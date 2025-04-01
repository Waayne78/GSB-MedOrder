import React from 'react';

const PractitionerAvatar = ({ practitioner, size = 'medium' }) => {
  const getAvatarUrl = (id, name) => {
    const seed = encodeURIComponent(`${name}-${id}`);
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&scale=80`;
  };
  
  const sizeClass = size === 'small' ? 'practitioner-avatar-small' : 
                   size === 'large' ? 'practitioner-avatar-large' : 
                   'practitioner-avatar-medium';
  
  return (
    <img 
      src={getAvatarUrl(practitioner.id, practitioner.name)} 
      alt={`Dr. ${practitioner.name}`} 
      className={`practitioner-avatar ${sizeClass}`}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(practitioner.name)}&background=0D8ABC&color=fff`;
      }}
    />
  );
};

export default PractitionerAvatar; 