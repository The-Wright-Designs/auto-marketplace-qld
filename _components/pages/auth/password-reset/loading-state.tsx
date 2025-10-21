export default function LoadingState() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-grey/10">
      <div className="text-center">
        <div className="spinner mb-4 place-self-center"></div>
        <p className="text-paragraph">Verifying password reset link...</p>
      </div>
    </div>
  );
}