import React from 'react'
import TemplateOne from './TemplateOne'
import TemplateTwo from './TemplateTwo'
import TemplateThree from './TemplateThree'

const RenderResume = ({
  template,
  resumeData,
  containerWidth,
}) => {
  switch(template){
    case "templateOne":
      return <TemplateOne resumeData={resumeData} containerWidth={containerWidth} />
    case "templateTwo":
      return <TemplateTwo resumeData={resumeData} containerWidth={containerWidth} />
    case "templateThree":
      return <TemplateThree resumeData={resumeData} containerWidth={containerWidth} />
      default:
        return <TemplateOne resumeData={resumeData} containerWidth={containerWidth} />
  }
}

export default RenderResume
