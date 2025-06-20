import React from 'react';

const AboutSection = ({ about }) => {
  if (!about) return null;

  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: about.About }} />
  );
};

export default AboutSection;
