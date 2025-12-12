import React, { useRef, useState, useEffect } from 'react'
import {resumeTemplates} from '@/utils/data'
import Tabs from './Tabs'
import { Check } from 'lucide-react'
import { TemplateCard } from './Card'
import RenderResume from './RenderResume'
import { DUMMY_RESUME_DATA } from '../utils/data'

const TAB_DATA = [{label: 'template'}]
const ThemeSelector = ({selectedTheme, setSelectedTheme, onClose, resumeData}) => {

    const resumRef = useRef(null)
    const [baseWidth, setBaseWidth] = useState(800);

    // Normalize theme value - "modern" maps to "01"
    const normalizeTheme = (theme) => {
      if (theme === "modern") return "01";
      return theme || "01";
    };

    const normalizedTheme = normalizeTheme(selectedTheme);
    const initialIndex = resumeTemplates.findIndex(t => t.id === normalizedTheme)
    const [selectedTemplate, setSelectedTemplate] = useState({
        theme: normalizedTheme || resumeTemplates[0]?.id || "01",
        index: initialIndex >= 0 ? initialIndex : 0
    });

    const [tableValue, setTableValue] = useState('templates')

    // Sync selectedTemplate when selectedTheme prop changes
    useEffect(() => {
      const normalized = normalizeTheme(selectedTheme);
      const index = resumeTemplates.findIndex(t => t.id === normalized);
      if (index >= 0) {
        setSelectedTemplate({
          theme: normalized,
          index: index
        });
      }
    }, [selectedTheme]);

    const handleThemeSelection = () => {
      setSelectedTheme(selectedTemplate.theme)
      onClose()
    }

    const updateBaseWidth = () => {
      if (resumRef.current) {
        setBaseWidth(resumRef.current.offsetWidth)
      }
    }

    useEffect(() => {
      updateBaseWidth()
      window.addEventListener('resize', updateBaseWidth)
      return () => {
        window.removeEventListener('resize', updateBaseWidth)
      }
    }, [])

  return (
    
    <div className='max-w-7xl mx-auto px-4'>
      {/* Header */}
        <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center gap-4 p-4 sm:p-6 bg-linear-to-r
        from-white to-violet-50 border border-violet-100 rounded-2xl shadow-sm'>
            <Tabs tabs={TAB_DATA} activeTab={tableValue} onChange={setTableValue}/>
            <button className='flex items-center gap-2 w-full sm:w-auto px-4 py-2 bg-violet-100 text-violet-700 font-bold rounded-xl hover:bg-violet-200 transition-all'
            onClick={handleThemeSelection}>
              <Check className='w-5 h-5' /> Apply Changes
            </button>
        </div>

        <div className='flex gap-2 h-full overflow-y-auto p-2 bg-white rounded-2xl border border-gray-100'>
            <div className='flex flex-col w-70 gap-4 h-120 overflow-y-auto p-2 bg-white rounded-2xl border border-gray-100 flex-shrink-0'>
              {resumeTemplates.map((template, index) => (
                <TemplateCard 
                key={`template_${index}`} 
                thumbnailImg={template.thumbnailImg}
                 isSelected={selectedTemplate.theme === template.id}
                  onSelect={() => setSelectedTemplate({theme: template.id, index})} 
                  />
              ))}
            </div>

          <div className='w-full flex-1 rounded-2xl border border-gray-100 h-150' ref={resumRef}>
            <RenderResume  template={
              selectedTemplate?.theme === "01" ? "templateOne" 
              : selectedTemplate?.theme === "02" ? "templateTwo" 
              : selectedTemplate?.theme === "03" ? "templateThree" 
              : "templateOne"
            } 
            resumeData={resumeData || DUMMY_RESUME_DATA} 
            containerWidth={'full'}
            />

          </div>

        </div>

        
    </div>
  );
};

export default ThemeSelector;
