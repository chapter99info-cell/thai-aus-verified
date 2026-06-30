import { Loader2 } from 'lucide-react'

export function PageLoading({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-white px-4">
      <Loader2 className="h-10 w-10 animate-spin text-[#D4A017]" aria-hidden />
      <p className="text-base font-semibold text-[#0D1B3E]">{message}</p>
    </div>
  )
}
