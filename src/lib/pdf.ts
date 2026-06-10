import { toast } from "sonner";

/**
 * Renders a DOM element to a single-page PDF and triggers a download.
 * Used for receipts, quotations, and payslips — all rendered as styled
 * HTML in the app, so we snapshot them rather than redrawing with jsPDF's
 * primitive drawing API.
 */
export async function downloadElementAsPdf(element: HTMLElement | null, filename: string) {
  if (!element) return;
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas-pro"),
      import("jspdf"),
    ]);

    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(filename.endsWith(".pdf") ? filename : `${filename}.pdf`);
  } catch (e: any) {
    toast.error(e?.message ?? "Failed to generate PDF");
  }
}
