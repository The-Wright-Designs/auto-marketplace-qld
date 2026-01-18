import { X, AlertCircle } from "lucide-react";

interface FileUploadErrorsProps {
  validationErrors: string[];
  failedFiles: Array<{
    file: File;
    error: string;
  }>;
  isValidating: boolean;
  onRetryFile: (index: number) => void;
  onRemoveFailedFile: (index: number) => void;
  disabled?: boolean;
}

const FileUploadErrors = ({
  validationErrors,
  failedFiles,
  isValidating,
  onRetryFile,
  onRemoveFailedFile,
  disabled = false,
}: FileUploadErrorsProps) => {
  return (
    <>
      {validationErrors.length > 0 && (
        <div className="bg-red/50 rounded-md p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <h4 className="text-paragraph font-semibold">
              Image upload errors:
            </h4>
          </div>
          <ul className="text-sm text-red-600 list-disc list-inside grid gap-1">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {failedFiles.length > 0 && (
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[16px] font-medium text-red-600">
              Failed uploads:
              <span className="ml-2 text-sm text-gray-600"></span>
            </p>
          </div>
          <div className="grid gap-3">
            {failedFiles.map((failedFile, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-md bg-red/20 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center">
                    <AlertCircle className="w-5 h-5" color="red" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-medium truncate max-w-[90px] phone:max-w-[200px] min-[600px]:max-w-full">
                      {failedFile.file.name}
                    </span>
                    <span className="text-[10px] text-red-600 truncate max-w-[90px] phone:max-w-[200px] min-[600px]:max-w-full">
                      {failedFile.error}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={() => onRetryFile(index)}
                    disabled={disabled || isValidating}
                    className="bg-blue px-2 font-normal text-[14px] text-white rounded-md"
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveFailedFile(index)}
                    disabled={disabled || isValidating}
                    className="p-2 -m-2 text-red-600 hover:text-red-800 desktop-small:p-0 desktop-small:m-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FileUploadErrors;
