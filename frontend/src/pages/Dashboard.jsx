import React, { useEffect, useCallback } from "react";
import DashboarLayout from "@/components/DashboarLayout";
import { dashboardStyles as styles } from "@/assets/dummystyle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LucideFilePlus, LucideTrash2, X } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { API_PATHS } from "@/utils/ApiPath";
import toast from "react-hot-toast";
import { ResumeSummaryCard } from "@/components/Card";
import Modal from "@/components/Modal";
import CreateResumeForm from "@/components/CreateResumeForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const calculateCompletion = (resume) => {
    let completedFields = 0;
    let totalFields = 0;

    // Profile Info
    totalFields += 3;
    if (resume.profileInfo?.fullName) completedFields++;
    if (resume.profileInfo?.designation) completedFields++;
    if (resume.profileInfo?.summary) completedFields++;

    // Contact Info
    totalFields += 2;
    if (resume.contactInfo?.email) completedFields++;
    if (resume.contactInfo?.phone) completedFields++;

    // Work Experience
    resume.workExperience?.forEach((exp) => {
      totalFields += 5;
      if (exp.company) completedFields++;
      if (exp.role) completedFields++;
      if (exp.startDate) completedFields++;
      if (exp.endDate) completedFields++;
      if (exp.description) completedFields++;
    });

    // Education
    resume.education?.forEach((edu) => {
      totalFields += 4;
      if (edu.degree) completedFields++;
      if (edu.institution) completedFields++;
      if (edu.startDate) completedFields++;
      if (edu.endDate) completedFields++;
    });

    // Skills
    resume.skills?.forEach((skill) => {
      totalFields += 2;
      if (skill.name) completedFields++;
      if (skill.progress > 0) completedFields++;
    });

    // Projects
    resume.projects?.forEach((project) => {
      totalFields += 4;
      if (project.title) completedFields++;
      if (project.description) completedFields++;
      if (project.github) completedFields++;
      if (project.liveDemo) completedFields++;
    });

    // Certifications
    resume.certifications?.forEach((cert) => {
      totalFields += 3;
      if (cert.title) completedFields++;
      if (cert.issuer) completedFields++;
      if (cert.year) completedFields++;
    });

    // Languages
    resume.languages?.forEach((lang) => {
      totalFields += 2;
      if (lang.name) completedFields++;
      if (lang.progress > 0) completedFields++;
    });

    // Interests
    totalFields += resume.interests?.length || 0;
    completedFields +=
      resume.interests?.filter((i) => i?.trim() !== "")?.length || 0;

    return Math.round((completedFields / totalFields) * 100);
  };

  const fetchAllResumes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(API_PATHS.RESUME.GET_ALL);
      const resumesWithCompletion = response.data.map((resume) => ({
        ...resume,
        completion: calculateCompletion(resume),
      }));
      setAllResumes(resumesWithCompletion);
    } catch (error) {
      console.error("Error fetching resumes", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch resumes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllResumes();
  }, [fetchAllResumes]);

  const handleDeleteResume = async () => {
    if (!resumeToDelete) return;
    try {
      await axiosInstance.delete(API_PATHS.RESUME.DELETE(resumeToDelete));
      toast.success("Resume deleted successfully");
      fetchAllResumes();
    } catch (error) {
      console.error("Error deleting resume", error);
      toast.error("Failed to delete resume");
    } finally {
      setResumeToDelete(null);
      setShowDeleteConfirmation(false);
    }
  };
  const handleDeleteClick = (id) => {
    setResumeToDelete(id);
    setShowDeleteConfirmation(true);
  };

  return (
    <DashboarLayout>
      <div className={styles.container}>
        <div className={styles.headerWrapper}>
          <div>
            <h1 className={styles.headerTitle}>My Resumes</h1>
            <p className={styles.headerSubtitle}>
              {allResumes.length > 0
                ? `You have ${allResumes.length} resumes ${
                    allResumes.length !== 1 ? "s" : ""
                  } created.`
                : "Start building your professional resume now."}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              className={styles.createButton}
              onClick={() => setOpenCreateModal(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Creat Now
                <LucideFilePlus
                  className="group-hover:translate-x-1 transition-transform"
                  size={18}
                />
              </span>
            </button>
          </div>
        </div>
        {/*Loading State */}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <div className={styles.spinner}></div>
          </div>
        )}
        {/* Emapty State*/}
        {!loading && allResumes.length === 0 && (
          <div className={styles.emptyStateWrapper}>
            <div className={styles.emptyIconWrapper}>
              <LucideFilePlus className="text-violet-600" size={32} />
            </div>
            <h2 className={styles.emptyTitle}>No resumes yet</h2>
            <p className={styles.emptyText}>
              Start creating your first resume to get started.
            </p>

            <button
              className={styles.createButton}
              onClick={() => setOpenCreateModal(true)}
            >
              <div className={styles.createButtonOverlay}></div>
              <span className={styles.createButtonContent}>
                Create your first resume
                <LucideFilePlus
                  className="group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </span>
            </button>
          </div>
        )}
        {/*Grid view*/}
        {!loading && allResumes.length > 0 && (
          <div className={styles.grid}>
            <div
              className={styles.newResumeCard}
              onClick={() => setOpenCreateModal(true)}
            >
              <div className={styles.newResumeIcon}>
                <LucideFilePlus className="text-white" size={32} />
              </div>
              <h3 className={styles.newResumeTitle}>Create new resume</h3>
              <p className={styles.newResumeText}>Start building your career</p>
            </div>
            {allResumes.map((resume) => (
              <ResumeSummaryCard
                key={resume._id}
                imgUrl={resume.thumbnailLink}
                title={resume.title}
                createdAt={resume.createdAt}
                updatedAt={resume.updatedAt}
                onSelect={() => navigate(`/resume/${resume._id}`)}
                onDelete={() => handleDeleteClick(resume._id)}
                completion={resume.completion || 0}
                isPremium={resume.isPremium}
                isNew={(() => {
                  const createdDate = new Date(resume.createdAt);
                  const now = new Date();
                  const diffTime = Math.abs(now - createdDate);
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  return diffDays <= 7;
                })()}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Resume Modal */}
      <Modal
        isOpen={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        hideHeader
        maxWidth="max-w-2xl"
      >
        <div className="p-6">
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>Create New Resume</h3>
          </div>
          <CreateResumeForm
            onSuccess={() => {
              setOpenCreateModal(false);
              fetchAllResumes();
            }}
          />
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        title="Delete Resume"
        showActionBtn
        actionBtnText="Delete"
        actionBtnClassName="bg-red-600 hover:bg-red-700"
        onActionClick={handleDeleteResume}
      >
        <div className="p-4">
          <div className="flex flex-col items-center text-center">
            <div className={styles.deleteIconWrapper}>
              <LucideTrash2 size={24} className="text-orange-600" />
            </div>
            <h3 className={styles.deleteTitle}>Delete Resume</h3>
            <p className={styles.deleteText}>
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </DashboarLayout>
  );
};

export default Dashboard;
