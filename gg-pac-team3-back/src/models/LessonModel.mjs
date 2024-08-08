import admin from '../config/firebase.mjs'; // Ensure path is correct

class LessonModel {
  constructor({
    lessonId,
    title,
    description = {}, // Default to empty object if not provided
    points = 0,
    order = 0,
    videoUrl = [], // Default to empty array if not provided
    materials = ''
  }) {
    // Validate types
    if (typeof lessonId !== 'string') throw new Error('Invalid lessonId');
    if (typeof title !== 'string') throw new Error('Invalid title');
    if (typeof points !== 'number') throw new Error('Invalid points');
    if (typeof order !== 'number') throw new Error('Invalid order');
    if (!Array.isArray(videoUrl)) throw new Error('Invalid videoUrl');
    if (typeof materials !== 'string') throw new Error('Invalid materials');
    if (typeof description !== 'object') throw new Error('Invalid description');

    this.lessonId = lessonId;
    this.title = title;
    this.description = description;
    this.points = points;
    this.order = order;
    this.videoUrl = videoUrl;
    this.materials = materials;
  }

  // Convert to Firestore format
  toFirestore() {
    return {
      lessonId: this.lessonId,
      title: this.title,
      description: this.description,
      points: this.points,
      order: this.order,
      videoUrl: this.videoUrl,
      materials: this.materials
    };
  }

  // Convert from Firestore format
  static fromFirestore(data) {
    return new LessonModel({
      lessonId: data.lessonId,
      title: data.title,
      description: data.description || {}, // Ensure default to empty object if not present
      points: data.points || 0, // Ensure default to 0 if not present
      order: data.order || 0, // Ensure default to 0 if not present
      videoUrl: data.videoUrl || [], // Ensure default to empty array if not present
      materials: data.materials || '' // Ensure default to empty string if not present
    });
  }
}

export default LessonModel;
