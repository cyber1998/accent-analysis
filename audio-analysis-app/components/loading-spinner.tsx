export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-24 h-24 border-4 border-[#F2E2E2] border-t-transparent rounded-full animate-spin" />
      <p className="text-xl">Analyzing your audio...</p>
    </div>
  )
}

