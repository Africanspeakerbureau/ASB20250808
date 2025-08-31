type CloudinaryUpload =
  | { secure_url: string; original_filename?: string; public_id?: string }
  | string;

 type AirtableAttachment = { url: string; filename?: string };

 export function toAirtableAttachments(
   input: unknown
 ): AirtableAttachment[] {
   if (!input) return [];
   const arr = Array.isArray(input) ? input : [input];

   return arr
     .map((item) => {
       // 1) Cloudinary upload response
       if (item && typeof item === "object" && "secure_url" in item) {
         const u = item as any;
         return {
           url: u.secure_url,
           filename: u.original_filename || u.public_id || undefined,
         };
       }
       // 2) Already-hosted URL string
       if (typeof item === "string" && /^https?:\/\//.test(item)) {
         return { url: item };
       }
       // 3) Objects from previous code paths: { url, filename, ...extras }
       if (item && typeof item === "object" && (item as any).url) {
         return { url: (item as any).url, filename: (item as any).filename };
       }
       return null;
     })
     .filter(Boolean) as AirtableAttachment[];
 }

