import React, { useRef, useState } from 'react'
import {resumeTemplates} from '@/utils/data'
import { Tabs } from './Tabs'
import { Check } from 'lucide-react'
import { TemplateCard } from './Card'
import RenderResume from './RenderResume'
import { DUMMY_RESUME_DATA } from '../utils/data'

const TAB_DATA = [{labe: 'template'}]
const ThemeSelector = ({selectedTheme, setSelectedTheme, onClose, resumeData}) => {

    const resumRef = useRef(null)
    const [baseWidth, setBaseWidth] = useState(800);

    const initialIndex = resumeTemplates.findIndex(t => t.id === selectedTheme)
    const [selectedTemplate, setSelectedTemplate] = useState({
        theme: selectedTheme || resumeTemplates[0]?.id || "",
        index: initialIndex >= 0 ? initialIndex : 0
    });

    const [tableValue, setTableValue] = useState('templates')

    const handleThemeSelection = () => {
      setSelectedTheme(selectedTemplate.theme)
      onClose()
    }

    const updateBaseWidth = () => {
      if (resumRef.current) {
        setBaseWidth(resumRef.current.offsetWidth)
      }
    }
  return (
    
    <div className='max-w-7xl mx-auto px-4'>
      {/* Header */}
        <div className='flex flex-col items-start justify-between sm:flex-row sm:items-center gap-4 mb-8 p-4 sm:p-6 bg-linear-to-r
        from-white to-violet-50 border border-violet-100 rounded-2xl shadow-sm'>
            <Tabs tabs={TAB_DATA} activeTab={tableValue} onChange={setTabActive}/>
            <button className='w-full sm:w-auto px-4 py-2 bg-violet-100 text-violet-700 font-bold rounded-xl hover:bg-violet-200 transition-all'
            onClick={handleThemeSelection}>
              <Check className='w-5 h-5' /> Apply Changes
            </button>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2  gap-4 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto p-2'>
          <div className='lg:col-span-2 bg-white rounded-2xl shadow-md p-4 border border-gray-200 sm:p-6'>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-15 lg:max-h-20 overflow-y-auto p-2'>
              {resumeTemplates.map((template, index) => (
                <TemplateCard 
                key={`template_${index}`} 
                thumbnailImg={template.thumbnailImg}
                 isSelected={selectedTemplate.theme === index}
                  onSelect={() => setSelectedTemplate({theme: template.id, index})} 
                  />
              ))}
            </div>
          </div>
          {/*Right Side*/}
          <div className='lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6' ref={resumRef}>
            <RenderResume  templateId={selectedTemplate?.theme || ""} 
            resumeData={resumeData || DUMMY_RESUME_DATA} 
            containerWidth={baseWidth}
            />

          </div>

        </div>

        
    </div>
  );
};

export default ThemeSelector;
