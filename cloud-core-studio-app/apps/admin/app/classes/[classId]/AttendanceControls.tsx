"use client";

import { useTransition } from "react";

const OPTIONS: { value: string; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "no_show", label: "No show" },
];

export function AttendanceControls({
  bookingId,
  classId,
  current,
  action,
}: {
  bookingId: string;
  classId: string;
  current: string | null;
  action: (formData: FormData) => Promise<{ ok?: boolean; error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  function submit(status: string) {
    const formData = new FormData();
    formData.set("booking_id", bookingId);
    formData.set("class_id", classId);
    formData.set("status", status);
    startTransition(async () => {
      await action(formData);
    });
  }

  return (
    <div className="attendance-controls" role="group" aria-label="Mark attendance">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="attendance-btn"
          aria-pressed={current === option.value}
          data-active={current === option.value}
          disabled={isPending}
          onClick={() => submit(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
