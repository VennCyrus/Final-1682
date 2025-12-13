# Frontend Architecture & Code Samples

## 1. Project Folder Structure

```
frontend/
├── public/                 # Static assets (images, icons)
│   └── vite.svg
├── src/
│   ├── assets/            # Project-specific assets and styles
│   │   ├── dummystyle.js  # Centralized style definitions
│   │   └── Resume*.png    # Template preview images
│   ├── components/        # Reusable UI components
│   │   ├── A4.css         # Print stylesheet for A4 format
│   │   ├── Card.jsx       # Resume card component
│   │   ├── CreateResumeForm.jsx
│   │   ├── DashboarLayout.jsx
│   │   ├── EditResume.jsx # Main resume editor (core component)
│   │   ├── Form.jsx       # Form components for resume sections
│   │   ├── Inputs.jsx     # Reusable input components
│   │   ├── Login.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Register.jsx
│   │   ├── RenderResume.jsx # Resume renderer router
│   │   ├── ResumeSection.jsx
│   │   ├── StepProgress.jsx
│   │   ├── Tabs.jsx
│   │   ├── TemplateOne.jsx   # Resume template 1
│   │   ├── TemplateTwo.jsx   # Resume template 2
│   │   ├── TemplateThree.jsx  # Resume template 3
│   │   └── ThemeSelector.jsx
│   ├── context/           # React Context API for state management
│   │   └── UserContext.jsx # Global user state management
│   ├── pages/             # Page-level components (routes)
│   │   ├── AdminDashboard.jsx
│   │   ├── Dashboard.jsx
│   │   └── LandingPage.jsx
│   ├── utils/             # Utility functions and helpers
│   │   ├── ApiPath.js     # API endpoint constants
│   │   ├── axiosInstance.js # Axios configuration with interceptors
│   │   ├── color.js       # Color utility functions
│   │   ├── data.js        # Static data/constants
│   │   ├── helper.js      # General helper functions
│   │   └── uploadImage.js # Image upload utilities
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite build configuration
└── jsconfig.json          # JavaScript/Path alias configuration
```

## 2. Organizational Logic

The frontend follows a **component-based architecture** with clear separation of concerns:

### **Layered Architecture:**
1. **Pages Layer** (`pages/`): Top-level route components that compose multiple components
2. **Components Layer** (`components/`): Reusable UI components following single responsibility principle
3. **Context Layer** (`context/`): Global state management using React Context API
4. **Utils Layer** (`utils/`): Shared utilities, API configuration, and helper functions
5. **Assets Layer** (`assets/`): Static resources and centralized styling

### **Key Design Patterns:**
- **Component Composition**: Complex pages are built by composing smaller, reusable components
- **Context API**: Global user state is managed through `UserContext` to avoid prop drilling
- **Custom Hooks**: Reusable logic extracted into custom hooks (e.g., `useResizeObserver` in EditResume)
- **Separation of Concerns**: 
  - Forms are separated from business logic
  - API calls are abstracted through `axiosInstance` with interceptors
  - Styling is centralized in `dummystyle.js` for consistency
- **Template Pattern**: Multiple resume templates (TemplateOne, Two, Three) share the same data structure but different rendering logic

### **State Management Strategy:**
- **Local State**: Component-specific state using `useState` hooks
- **Global State**: User authentication state via `UserContext`
- **Server State**: Resume data fetched and managed locally with React hooks

---

## 3. Code Sample: EditResume Component

The `EditResume` component is the **core component** of the application, handling the entire resume creation and editing workflow. It demonstrates complex state management, form validation, multi-step navigation, and PDF generation.

```javascript
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboarLayout from "./DashboarLayout";
import { containerStyles } from "@/assets/dummystyle";
import { TitleInput } from "./Inputs";
import { buttonStyles, statusStyles, iconStyles } from "@/assets/dummystyle";
import { Download, Palette, Trash2, AlertCircle, ArrowLeft, Save, Loader2, ArrowRight } from "lucide-react";
import { API_PATHS } from "@/utils/ApiPath";
import axiosInstance from "@/utils/axiosInstance";
import toast from "react-hot-toast";
import { fixTailwindColors } from "@/utils/color";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import { dataURLtoFile } from "@/utils/helper";
import StepProgress from "./StepProgress";
import RenderResume from "./RenderResume";
import Modal from "./Modal";
import ThemeSelector from "./ThemeSelector";
import {
  ProfileInfoForm,
  ContactInfoForm,
  WorkExperienceForm,
  EducationDetailsForm,
  SkillsInfoForm,
  ProjectDetailForm,
  CertificationInfoForm,
  AdditionalInfoForm,
} from "./Form";

/**
 * Custom Hook: useResizeObserver
 * Monitors the size of a DOM element using ResizeObserver API
 * Returns the width, height, and a ref to attach to the element
 * Used for responsive preview rendering
 */
const useResizeObserver = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const nodeRef = useRef(null);

  // useCallback ensures the ref function is stable across re-renders
  const ref = useCallback((node) => {
    nodeRef.current = node;
  }, []);

  useEffect(() => {
    if (!nodeRef.current) return;

    // Create ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ width, height });
    });

    // Start observing the element
    resizeObserver.observe(nodeRef.current);

    // Cleanup: disconnect observer when component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ...size, ref };
};

/**
 * Main Component: EditResume
 * Handles the complete resume editing workflow with:
 * - Multi-step form navigation (8 steps)
 * - Real-time preview generation
 * - Form validation
 * - PDF export functionality
 * - Thumbnail generation
 * - Resume data persistence
 */
const EditResume = () => {
  const { resumeId } = useParams(); // Get resume ID from URL
  const navigate = useNavigate();
  const resumeDownloadRef = useRef(null); // Ref for PDF generation
  const thumbnailRef = useRef(null);

  // UI State Management
  const [openThemeSelector, setOpenThemeSelector] = useState(false);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("profile-info"); // Current form step
  const [progress, setProgress] = useState(0); // Progress bar percentage
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Get preview container dimensions for responsive rendering
  const { width: previewWidth, ref: previewContainerRef } = useResizeObserver();

  /**
   * Resume Data State
   * Centralized state object containing all resume information
   * Structure matches the backend schema
   */
  const [resumeData, setResumeData] = useState({
    title: "Professional Resume",
    thumbnailLink: "",
    profileInfo: {
      fullName: "",
      designation: "",
      summary: "",
    },
    template: {
      theme: "modern",
      colorPalette: [],
    },
    contactInfo: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      website: "",
    },
    workExperience: [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        startDate: "",
        endDate: "",
      },
    ],
    skills: [
      {
        name: "",
        progress: 0,
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        github: "",
        liveDemo: "",
      },
    ],
    certifications: [
      {
        title: "",
        issuer: "",
        year: "",
      },
    ],
    languages: [
      {
        name: "",
        progress: 0,
      },
    ],
    interests: [""],
  });

  /**
   * Function: calculateCompletion
   * Calculates the completion percentage of the resume
   * Iterates through all resume sections and counts filled fields
   * Returns percentage rounded to nearest integer
   * 
   * Algorithm:
   * 1. Initialize counters for completed and total fields
   * 2. For each section (profile, contact, work, education, etc.):
   *    - Add section's field count to total
   *    - Count how many fields are filled
   * 3. Calculate percentage: (completed / total) * 100
   * 4. Update state and return value
   */
  const calculateCompletion = useCallback(() => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info: 3 required fields
    totalFields += 3;
    if (resumeData.profileInfo.fullName) completedFields++;
    if (resumeData.profileInfo.designation) completedFields++;
    if (resumeData.profileInfo.summary) completedFields++;

    // Contact Info: 2 required fields
    totalFields += 2;
    if (resumeData.contactInfo.email) completedFields++;
    if (resumeData.contactInfo.phone) completedFields++;

    // Work Experience: 5 fields per entry
    resumeData.workExperience.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education: 4 fields per entry
    resumeData.education.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills: 2 fields per entry (name and progress)
    resumeData.skills.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects: 4 fields per entry
    resumeData.projects.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications: 3 fields per entry
    resumeData.certifications.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages: 2 fields per entry
    resumeData.languages.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests: count non-empty entries
    totalFields += resumeData.interests.length;
    completedFields += resumeData.interests.filter(
      (i) => i.trim() !== ""
    ).length;

    // Calculate and update percentage
    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
    return percentage;
  }, [resumeData]);

  // Recalculate completion whenever resumeData changes
  useEffect(() => {
    calculateCompletion();
  }, [calculateCompletion]);

  /**
   * Function: validateAndNext
   * Validates the current form step before allowing navigation to next step
   * Uses switch statement to apply step-specific validation rules
   * 
   * Validation Rules:
   * - Profile: fullName, designation, summary required
   * - Contact: valid email format, 10-digit phone
   * - Work Experience: company, role, dates required; endDate > startDate
   * - Education: degree, institution, dates required; endDate > startDate
   * - Skills: name required, progress between 1-100
   * - Projects: title and description required
   * - Certifications: title and issuer required
   * - Additional: at least one language and interest
   * 
   * @returns {void} - Sets error message or proceeds to next step
   */
  const validateAndNext = () => {
    const errors = [];

    switch (currentPage) {
      case "profile-info": {
        const { fullName, designation, summary } = resumeData.profileInfo;
        if (!fullName.trim()) errors.push("Full Name is required");
        if (!designation.trim()) errors.push("Designation is required");
        if (!summary.trim()) errors.push("Summary is required");
        break;
      }

      case "contact-info": {
        const { email, phone } = resumeData.contactInfo;
        // Email validation regex
        if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email))
          errors.push("Valid email is required.");
        // Phone validation: exactly 10 digits
        if (!phone.trim() || !/^\d{10}$/.test(phone))
          errors.push("Valid 10-digit phone number is required");
        break;
      }

      case "work-experience":
        // Validate each work experience entry
        resumeData.workExperience.forEach(
          ({ company, role, startDate, endDate }, index) => {
            if (!company || !company.trim())
              errors.push(`Company is required in experience ${index + 1}`);
            if (!role || !role.trim())
              errors.push(`Role is required in experience ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in experience ${index + 1}`
              );
            // Date logic validation
            if (startDate && endDate && startDate > endDate)
              errors.push(
                `End date must be after start date in experience ${index + 1}`
              );
          }
        );
        break;

      case "education-info":
        // Similar validation for education entries
        resumeData.education.forEach(
          ({ degree, institution, startDate, endDate }, index) => {
            if (!degree.trim())
              errors.push(`Degree is required in education ${index + 1}`);
            if (!institution.trim())
              errors.push(`Institution is required in education ${index + 1}`);
            if (!startDate || !endDate)
              errors.push(
                `Start and End dates are required in education ${index + 1}`
              );
            if (startDate && endDate && startDate > endDate)
              errors.push(
                `End date must be after start date in education ${index + 1}`
              );
          }
        );
        break;

      case "skills":
        resumeData.skills.forEach(({ name, progress }, index) => {
          if (!name.trim())
            errors.push(`Skill name is required in skill ${index + 1}`);
          if (progress < 1 || progress > 100)
            errors.push(
              `Skill progress must be between 1 and 100 in skill ${index + 1}`
            );
        });
        break;

      case "projects":
        resumeData.projects.forEach(({ title, description }, index) => {
          if (!title.trim())
            errors.push(`Project Title is required in project ${index + 1}`);
          if (!description.trim())
            errors.push(
              `Project description is required in project ${index + 1}`
            );
        });
        break;

      case "certifications":
        resumeData.certifications.forEach(({ title, issuer }, index) => {
          if (!title.trim())
            errors.push(
              `Certification Title is required in certification ${index + 1}`
            );
          if (!issuer.trim())
            errors.push(`Issuer is required in certification ${index + 1}`);
        });
        break;

      case "additionalInfo":
        // At least one language and interest required
        if (
          resumeData.languages.length === 0 ||
          !resumeData.languages[0].name?.trim()
        ) {
          errors.push("At least one language is required");
        }
        if (
          resumeData.interests.length === 0 ||
          !resumeData.interests[0]?.trim()
        ) {
          errors.push("At least one interest is required");
        }
        break;

      default:
        break;
    }

    // If validation errors exist, display them and prevent navigation
    if (errors.length > 0) {
      setErrorMsg(errors.join(", "));
      return;
    }

    // Clear errors and proceed to next step
    setErrorMsg("");
    goToNextStep();
  };

  /**
   * Function: goToNextStep
   * Handles navigation to the next form step
   * Updates progress bar and scrolls to top for better UX
   * If on last step, opens preview modal instead
   */
  const goToNextStep = () => {
    const pages = [
      "profile-info",
      "contact-info",
      "work-experience",
      "education-info",
      "skills",
      "projects",
      "certifications",
      "additionalInfo",
    ];

    // If on last step, open preview modal
    if (currentPage === "additionalInfo") setOpenPreviewModal(true);

    const currentIndex = pages.indexOf(currentPage);
    if (currentIndex !== -1 && currentIndex < pages.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentPage(pages[nextIndex]);

      // Update progress bar: (current step / total steps) * 100
      const percent = Math.round((nextIndex / (pages.length - 1)) * 100);
      setProgress(percent);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * Function: updateArrayItem
   * Updates a specific field in an array item within resumeData
   * Uses functional state update to ensure immutability
   * 
   * @param {string} section - The section name (e.g., "workExperience")
   * @param {number} index - Index of the item in the array
   * @param {string|null} key - Field name to update (null = replace entire item)
   * @param {any} value - New value for the field
   */
  const updateArrayItem = (section, index, key, value) => {
    setResumeData((prev) => {
      // Create a shallow copy of the array
      const updatedArray = [...prev[section]];

      if (key === null) {
        // Replace entire item
        updatedArray[index] = value;
      } else {
        // Update specific field while preserving other fields
        updatedArray[index] = {
          ...updatedArray[index],
          [key]: value,
        };
      }

      // Return new state with updated array
      return {
        ...prev,
        [section]: updatedArray,
      };
    });
  };

  /**
   * Function: uploadResumeImages
   * Handles the complete save workflow:
   * 1. Updates resume data in database
   * 2. Generates thumbnail from preview
   * 3. Uploads thumbnail to server
   * 4. Updates resume with thumbnail link
   * 
   * Uses html2canvas to convert DOM element to image
   * Converts image to File object for multipart upload
   */
  const uploadResumeImages = async () => {
    try {
      setIsLoading(true);

      // Step 1: Update resume details first
      await updateResumeDetails("");

      // Step 2: Generate thumbnail from preview
      const resumeElement = resumeDownloadRef.current;
      if (resumeElement) {
        try {
          // Fix Tailwind colors for canvas rendering
          const fixedThumbnail = fixTailwindColors(resumeElement);

          // Convert DOM element to canvas using html2canvas
          const thumbnailCanvas = await html2canvas(fixedThumbnail, {
            scale: 0.5, // Lower scale for smaller file size
            backgroundColor: "#FFFFFF",
            logging: false,
          });

          // Cleanup: remove cloned element if it was added to body
          if (fixedThumbnail !== resumeElement && fixedThumbnail.parentNode === document.body) {
            document.body.removeChild(fixedThumbnail);
          }

          // Convert canvas to data URL (base64 image)
          const thumbnailDataUrl = thumbnailCanvas.toDataURL("image/png");
          
          // Convert data URL to File object for upload
          const thumbnailFile = dataURLtoFile(
            thumbnailDataUrl,
            `thumbnail-${resumeId}.png`
          );

          // Create FormData for multipart upload
          const formData = new FormData();
          formData.append("thumbnail", thumbnailFile);

          // Upload thumbnail to server
          const uploadResponse = await axiosInstance.put(
            API_PATHS.RESUME.UPLOAD_IMAGE(resumeId),
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          // Update resume with thumbnail link
          const { thumbnailLink } = uploadResponse.data;
          await updateResumeDetails(thumbnailLink);
        } catch (thumbnailError) {
          // Continue without thumbnail if generation fails
          console.warn("Failed to generate thumbnail, continuing without it:", thumbnailError);
        }
      }

      toast.success("Resume Updated Successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error Uploading Images:", error);
      toast.error(error.response?.data?.message || "Failed to save resume. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Function: downloadPDF
   * Generates and downloads a PDF version of the resume
   * Uses html2pdf library which combines html2canvas and jsPDF
   * 
   * Process:
   * 1. Apply print-friendly styles (black text, white background)
   * 2. Configure PDF options (A4 format, margins, scaling)
   * 3. Convert HTML to PDF
   * 4. Trigger browser download
   * 5. Cleanup styles
   */
  const downloadPDF = async () => {
    const element = resumeDownloadRef.current;
    if (!element) {
      toast.error("Failed to generate PDF. Please try again.");
      return;
    }

    setIsDownloading(true);
    setDownloadSuccess(false);
    const toastId = toast.loading("Generating PDF...");

    // Inject print-friendly styles for PDF generation
    const override = document.createElement("style");
    override.id = "__pdf_color_override__";
    override.textContent = `
      * {
        color: #000 !important;
        background-color: #fff !important;
        border-color: #000 !important;
      }
    `;
    document.head.appendChild(override);

    try {
      // Generate PDF using html2pdf
      await html2pdf()
        .set({
          margin: 0,
          filename: `${resumeData.title.replace(/[^a-z0-9]/gi, "_")}.pdf`,
          image: { type: "png", quality: 1.0 },
          html2canvas: {
            scale: 2, // High quality rendering
            useCORS: true,
            backgroundColor: "#FFFFFF",
            logging: false,
            windowWidth: element.scrollWidth,
          },
          jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait",
          },
          pagebreak: {
            mode: ["avoid-all", "css", "legacy"],
          },
        })
        .from(element)
        .save();

      toast.success("PDF downloaded successfully!", { id: toastId });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error(`Failed to generate PDF: ${err.message}`, { id: toastId });
    } finally {
      // Cleanup: remove injected styles
      document.getElementById("__pdf_color_override__")?.remove();
      setIsDownloading(false);
    }
  };

  // Fetch resume data when component mounts or resumeId changes
  useEffect(() => {
    if (resumeId) {
      fetchResumeDetailsById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId]);

  // Component render with conditional form rendering based on current step
  return (
    <DashboarLayout>
      {/* Main container with form and preview */}
      <div className={containerStyles.main}>
        {/* Header with title input and action buttons */}
        <div className={containerStyles.header}>
          <TitleInput
            title={resumeData.title}
            setTitle={(value) =>
              setResumeData((prev) => ({ ...prev, title: value }))
            }
          />
          {/* Action buttons: Theme, Delete, Preview */}
        </div>

        {/* Two-column layout: Form on left, Preview on right */}
        <div className={containerStyles.grid}>
          <div className={containerStyles.formContainer}>
            <StepProgress progress={progress} />
            {renderForm()} {/* Renders current step's form */}
            {/* Navigation buttons */}
          </div>
          {/* Live preview panel (hidden on mobile) */}
          <div className="hidden lg:block">
            <RenderResume
              template={resumeData?.template?.theme}
              resumeData={resumeData}
              containerWidth={previewWidth}
            />
          </div>
        </div>
      </div>

      {/* Modals for theme selection and PDF preview */}
      <Modal isOpen={openThemeSelector} onClose={() => setOpenThemeSelector(false)}>
        <ThemeSelector />
      </Modal>
      <Modal isOpen={openPreviewModal} onClose={() => setOpenPreviewModal(false)}>
        <div ref={resumeDownloadRef}>
          <RenderResume template={resumeData.template?.theme} resumeData={resumeData} />
        </div>
      </Modal>
    </DashboarLayout>
  );
};

export default EditResume;
```

### **Key Features Demonstrated:**

1. **Complex State Management**: Manages 8 different form sections with nested objects and arrays
2. **Multi-step Navigation**: Implements wizard-style form with validation at each step
3. **Real-time Preview**: Live preview updates as user types using ResizeObserver
4. **PDF Generation**: Converts HTML to PDF using html2canvas and jsPDF
5. **Thumbnail Generation**: Creates preview thumbnails for resume cards
6. **Form Validation**: Comprehensive validation with user-friendly error messages
7. **Completion Tracking**: Calculates and displays resume completion percentage
8. **Responsive Design**: Adapts layout for mobile and desktop views

---

## 4. Additional Code Sample: Axios Interceptor Configuration

The `axiosInstance.js` demonstrates **interceptor pattern** for centralized request/response handling:

```javascript
import axios from "axios";
import { BASE_URL } from "./ApiPath";

/**
 * Axios Instance Configuration
 * Creates a configured axios instance with:
 * - Base URL for all requests
 * - Default timeout (10 seconds)
 * - Default headers (JSON content type)
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all requests
 * Token is retrieved from localStorage
 * 
 * Flow:
 * 1. Check if token exists in localStorage
 * 2. If exists, add to Authorization header
 * 3. Return modified config
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles global error responses:
 * - 401 Unauthorized: Redirect to login
 * - 500 Server Error: Log error details
 * - Network errors: Display connection message
 * - Timeout errors: Handle gracefully
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status) {
      if (error.response.status === 401) {
        // Unauthorized - redirect to login
        window.location.href = "/";
      } else if (error.response.status === 500) {
        console.error("Server Error:", error.response.data);
      }
    } else if (error.code === "ERR_CANCELED" || error.code === "ECONNABORTED") {
      console.error("Request timeout or canceled");
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network Error: Could not connect to server. Please check if backend is running.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## Summary

The frontend architecture demonstrates:
- **Modular Design**: Clear separation between components, pages, and utilities
- **Reusability**: Shared components and utilities reduce code duplication
- **Maintainability**: Centralized styling and API configuration
- **Scalability**: Component-based structure allows easy feature additions
- **User Experience**: Real-time preview, validation, and progress tracking
- **Performance**: Efficient state management and lazy loading where applicable

