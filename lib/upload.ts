import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

/**
 * Saves an array of File objects locally in public/uploads.
 * @param files The files to be saved
 * @param folderName Target sub-directory under public/uploads (e.g., 'products')
 * @returns An array of string paths referring to the URL accessible via next server.
 */
export async function saveImagesLocal(
  files: File[],
  folderName: string = "products"
): Promise<string[]> {
  const uploadDir = join(process.cwd(), "public/uploads", folderName);
  
  // Ensure the directory exists
  mkdirSync(uploadDir, { recursive: true });

  const urls: string[] = [];

  for (const file of files) {
    if (file.size === 0) continue;

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create random filename string to avoid collisions
    const randomName = randomBytes(16).toString("hex");
    const extension = file.name.split(".").pop();
    const fileName = `${randomName}.${extension}`;

    const filePath = join(uploadDir, fileName);
    writeFileSync(filePath, buffer);

    // Provide the proxy friendly URL relative to domain
    urls.push(`/uploads/${folderName}/${fileName}`);
  }

  return urls;
}
