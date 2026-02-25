export default function Loading() {
  return (
    <div className="min-h-screen bg-off-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-14 border border-berkeley-blue/15 flex flex-col items-center justify-center mb-4 animate-pulse">
          <span className="text-[6px] text-berkeley-blue/20 font-body tracking-[0.2em]">
            97
          </span>
          <span className="text-lg font-heading font-bold text-berkeley-blue/20 leading-none">
            Bk
          </span>
        </div>
        <div className="w-5 h-5 border-2 border-berkeley-blue/10 border-t-berkeley-blue/40 rounded-full animate-spin" />
      </div>
    </div>
  )
}
