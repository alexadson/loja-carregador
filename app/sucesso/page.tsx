import { Suspense } from "react";
import SuccessContent from "@/components/SuccessContent";

export default function SucessoPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-24">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
