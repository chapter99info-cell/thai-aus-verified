export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0D1B3E]">
      <div
        className="h-12 w-12 animate-spin rounded-full border-4 border-[#C9A84C]/30 border-t-[#C9A84C]"
        role="status"
        aria-label="กำลังโหลด"
      />
    </div>
  )
}
