type Props = {
  count: number
}

export function CategoryCountLabel({ count }: Props) {
  if (count === 0) {
    return (
      <span className="mt-1 block text-xs font-medium italic text-green-600">
        เปิดรับลงทะเบียน
      </span>
    )
  }

  return <span className="mt-1 block text-sm text-slate-600">{count} ธุรกิจ</span>
}
