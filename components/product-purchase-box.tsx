"use client";

import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import type { DigitalProduct } from "@/lib/products";

type ProductPurchaseBoxProps = {
  product: DigitalProduct;
  unlocked: boolean;
  unlockEnabled: boolean;
  downloadHref: string;
};

export function ProductPurchaseBox({ product, unlocked, unlockEnabled, downloadHref }: ProductPurchaseBoxProps) {
  const [unlockCode, setUnlockCode] = useState("");
  const [qrFailed, setQrFailed] = useState(false);

  function goToUnlock() {
    const code = unlockCode.trim();
    if (!code) return;
    window.location.href = `${product.path}?unlock=${encodeURIComponent(code)}`;
  }

  if (unlocked) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
        <div className="inline-flex rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
          已解锁
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-950">压缩包已出现，可以下载</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          下载链接由付款核对码解锁，请不要公开分享。后续如需要安装支持，请继续通过微信联系。
        </p>
        <a href={downloadHref} className={buttonStyles({ size: "lg", className: "mt-6 w-full rounded-full" })}>
          下载 {product.downloadName}
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-950">购买流程</h2>
          <div className="mt-1 text-sm text-slate-500">先加客服微信，确认后再付款</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-violet-700">首批试用价</div>
          <div className="text-3xl font-black text-slate-950">{product.priceLabel}</div>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
        {!qrFailed ? (
          <img
            src={product.paymentQrImage}
            alt={`${product.title} 微信收款码`}
            className="mx-auto aspect-square w-full max-w-64 rounded-xl bg-white object-contain"
            onError={() => setQrFailed(true)}
          />
        ) : (
          <div className="mx-auto flex aspect-square w-full max-w-64 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <div className="text-sm font-semibold text-slate-700">收款码待上传</div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              上传 public/payment-qr.png 后，这里会自动显示。
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 rounded-2xl border border-violet-100 bg-violet-50 p-4">
        <div className="flex gap-3 text-sm leading-6 text-slate-700">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
            1
          </span>
          <span>先加客服微信，确认你的 Mac 和 Codex 情况</span>
        </div>
        <div className="flex gap-3 text-sm leading-6 text-slate-700">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
            2
          </span>
          <span>确认无误后，扫码付款 {product.priceLabel}</span>
        </div>
        <div className="flex gap-3 text-sm leading-6 text-slate-700">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
            3
          </span>
          <span>客服确认收款后发送下载码，在本页输入即可下载 ZIP</span>
        </div>
      </div>

      {unlockEnabled ? (
        <div className="mt-6 border-t border-slate-200 pt-5">
          <label className="text-xs font-semibold text-slate-500" htmlFor="unlock-code">
            已有下载码
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="unlock-code"
              value={unlockCode}
              onChange={(event) => setUnlockCode(event.target.value)}
              className="h-11 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              placeholder="输入下载码"
            />
            <button
              type="button"
              onClick={goToUnlock}
              disabled={!unlockCode.trim()}
              className={buttonStyles({ size: "md", className: "shrink-0 rounded-xl px-4" })}
            >
              解锁
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
          自动下载码尚未配置。当前可先扫码付款，再找客服要下载码。
        </div>
      )}
    </div>
  );
}
