export const formatDate=(iso:string,locale="vi-VN")=>new Date(iso).toLocaleString(locale,{dateStyle:"medium",timeStyle:"short"});
