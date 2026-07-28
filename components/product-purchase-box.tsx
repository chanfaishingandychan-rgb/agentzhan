"use client";

import { useEffect, useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import type { DigitalProduct } from "@/lib/products";

type ProductPurchaseBoxProps = {
  product: DigitalProduct;
  unlocked: boolean;
  unlockEnabled: boolean;
  downloadHref: string;
};

function createOrderCode(productSlug: string) {
  const date = new Date();
  const ymd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `AZ-${productSlug.toUpperCase()}-${ymd}-${random}`;
}

export function ProductPurchaseBox({ product, unlocked, unlockEnabled, downloadHref }: ProductPurchaseBoxProps) {
  const [orderCode, setOrderCode] = useState("");
  const [unlockCode, setUnlockCode] = useState("");
  const [payerName, setPayerName] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [qrFailed, setQrFailed] = useState(false);

  useEffect(() => {
    const storageKey = `agentzhan-order-${product.slug}`;
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      setOrderCode(stored);
      return;
    }

    const nextCode = createOrderCode(product.slug);
    window.localStorage.setItem(storageKey, nextCode);
    setOrderCode(nextCode);
  }, [product.slug]);

  const verifyText = [
    `我已购买：${product.title}`,
    `金额：${product.priceLabel}`,
    `付款备注码：${orderCode || "页面生成中"}`,
    payerName ? `付款人：${payerName}` : "",
    paymentRef ? `交易号 / 截图说明：${paymentRef}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  async function copyVerifyText() {
    if (!verifyText) return;
    try {
      await navigator.clipboard.writeText(verifyText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

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
          <h2 className="text-lg font-bold text-slate-950">扫码购买</h2>
          <div className="mt-1 text-sm text-slate-500">付款核对后解锁 ZIP</div>
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

      <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
        <div className="text-xs font-semibold text-violet-700">付款备注码</div>
        <div className="mt-2 break-all rounded-xl bg-white px-3 py-2 font-mono text-sm font-semibold text-slate-950">
          {orderCode || "正在生成..."}
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          付款时尽量填写这串备注码；如果平台不能备注，付款后把备注码和交易截图一起发给{product.supportLabel}。
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <input
          value={payerName}
          onChange={(event) => setPayerName(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          placeholder="付款人昵称 / 姓名"
        />
        <input
          value={paymentRef}
          onChange={(event) => setPaymentRef(event.target.value)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
          placeholder="交易号 / 支付截图说明"
        />
        <button
          type="button"
          className={buttonStyles({ variant: "outline", size: "lg", className: "w-full rounded-full" })}
          onClick={() => {
            setSubmitted(true);
            void copyVerifyText();
          }}
        >
          {copied ? "核对信息已复制" : "复制付款核对信息"}
        </button>
        {submitted && (
          <p className="text-xs leading-6 text-slate-500">
            把核对信息发送给{product.supportLabel}。核对后会收到下载码，回到本页输入即可显示压缩包。
          </p>
        )}
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
          自动下载码尚未配置。当前可先扫码付款并发送核对信息，核对后通过微信交付 ZIP。
        </div>
      )}

      <a
        href={product.supportHref}
        className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
      >
        打开{product.supportLabel}
      </a>
    </div>
  );
}
