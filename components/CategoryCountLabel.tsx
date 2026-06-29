type Props = {
  count: number
}

export function CategoryCountLabel({ count }: Props) {
  if (count === 0) {
    return (
      <span className="mt-1 block text-xs text-gray-400 italic">เปิดรับลงทะเบียน</span>
    )
  }

  return <span className="mt-1 block">{count} ธุรกิจ</span>
}
