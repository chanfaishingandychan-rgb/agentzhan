import { Check, FileText } from "lucide-react";

const workflowItems = [
  { title: "首页文案", source: "0916 会议记录", status: "已完成", done: true },
  { title: "手机菜单", source: "项目进度表", status: "已完成", done: true },
  { title: "付款 FAQ", source: "负责人未填写", status: "待确认", done: false },
];

export function HeroWorkflowScene() {
  return (
    <div className="relative mx-auto h-72 w-full max-w-[34rem] sm:h-[20rem] lg:h-[34rem] lg:max-w-none" aria-label="项目资料整理成周报的工作流示例">
      <div className="absolute left-[8%] top-4 text-[4.5rem] font-semibold leading-none text-neutral-200/80 sm:text-[6rem] lg:left-[4%] lg:top-12 lg:text-[9rem]">
        01
      </div>

      <div className="absolute inset-x-0 bottom-0 top-6 overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-[0_24px_80px_rgba(18,18,18,0.10)] sm:left-[8%] sm:top-10 lg:bottom-8 lg:left-[12%] lg:right-0 lg:top-20">
        <div className="flex items-center justify-between border-b border-neutral-200 px-3 py-2 sm:px-5 sm:py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-950 text-white sm:h-9 sm:w-9">
              <FileText aria-hidden="true" className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xs font-semibold text-neutral-950 sm:text-sm">网站改版 / 本周进度</div>
              <div className="mt-0.5 text-[10px] text-neutral-500 sm:text-xs">Google Drive · 3 份项目资料</div>
            </div>
          </div>
          <div className="hidden text-xs font-medium text-neutral-500 sm:block">2026.09.23</div>
        </div>

        <div className="divide-y divide-neutral-100 px-4 sm:px-5">
          {workflowItems.map((item, index) => (
            <div key={item.title} className="grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 py-2.5 sm:py-4">
              <span className={`flex h-6 w-6 items-center justify-center rounded-md ${item.done ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                {item.done ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : <span className="text-[10px] font-bold">{index + 1}</span>}
              </span>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-900 sm:text-sm">{item.title}</div>
                <div className="mt-0.5 truncate text-[10px] text-neutral-500 sm:text-xs">来源：{item.source}</div>
              </div>
              <span className={`text-xs font-semibold ${item.done ? "text-emerald-700" : "text-amber-700"}`}>{item.status}</span>
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-neutral-200 bg-[#f6f6f3] px-3 py-2 sm:px-5 sm:py-3">
          <div>
            <div className="text-[10px] font-semibold uppercase text-neutral-500">Output</div>
            <div className="mt-0.5 text-xs font-semibold text-neutral-950 sm:text-sm">可执行项目周报</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-medium text-neutral-600 sm:text-xs">
            <span className="h-2 w-2 rounded-sm bg-emerald-500" />
            已标记资料缺口
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 hidden items-center gap-3 rounded-lg bg-neutral-950 px-4 py-3 text-white shadow-[0_12px_36px_rgba(18,18,18,0.18)] sm:flex lg:bottom-0 lg:left-[4%]">
        <span className="text-xs text-neutral-400">输入</span>
        <span className="text-sm font-semibold">3 份资料</span>
        <span className="text-neutral-500">→</span>
        <span className="text-xs text-neutral-400">输出</span>
        <span className="text-sm font-semibold">1 份周报</span>
      </div>
    </div>
  );
}
