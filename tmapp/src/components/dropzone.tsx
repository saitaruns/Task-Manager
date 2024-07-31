import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export default function FileDrop({
  onFileDrop,
}: {
  onFileDrop: (data: string) => void;
}) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file: File) => {
        const reader = new FileReader();

        reader.onabort = () => {
          toast.error("File reading was aborted");
        };
        reader.onerror = () => {
          toast.error("Failed to read the file");
        };
        reader.onload = () => {
          const result = reader.result as ArrayBuffer;
          const jsonData = new TextDecoder().decode(result);

          onFileDrop(jsonData);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [onFileDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "application/json": [".json"],
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="text-[#C0BDBD] text-[14px] font-[400] cursor-pointer mt-2 mb-3">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Start writing, or drag your own files here</p>
        )}
      </div>
    </div>
  );
}
