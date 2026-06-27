import { KycUploadForm } from '@/components/verify/KycUploadForm'

export const metadata = {
  title: 'ยืนยันตัวตน KYC | Thai-Aus Verified',
}

export default function VerifyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-[#1e3a5f]">ยืนยันตัวตน (KYC)</h1>
      <p className="mt-2 text-sm text-slate-600">
        อัปโหลดเอกสารเพื่อรับ Badge Verified (PDF, JPG, PNG สูงสุด 5MB)
      </p>
      <div className="mt-8">
        <KycUploadForm />
      </div>
    </div>
  )
}
