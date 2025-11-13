import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadFileToFirebase(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function generateFirebasePath(userId: number, assignmentId: number, filename: string): string {
  const timestamp = Date.now();
  const extension = getFileExtension(filename);
  return `assignments/${userId}/${assignmentId}/${timestamp}.${extension}`;
}
