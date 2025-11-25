import Experience from './Experience.js';

const canvas = document.querySelector('.webgl');
const experience = new Experience(canvas);

// Optional: Make available globally for debugging
window.experience = experience;
