"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FIELDS, isAnswered, validate } from "@/lib/lead/fields";
import { captureAttribution } from "@/lib/lead/attribution";
import { submitLead } from "@/lib/lead/actions";
import { site } from "@/site.config";

const TOGGLE =
  "border border-grey-800 bg-grey-950 font-normal text-grey-200 hover:border-grey-700 hover:bg-grey-950 hover:text-white dark:hover:bg-grey-950 dark:hover:text-white data-[state=on]:border-primary/70 data-[state=on]:bg-primary/10 data-[state=on]:text-white dark:data-[state=on]:bg-primary/10 dark:data-[state=on]:text-white";

const CONTROL =
  "rounded-[10px] bg-grey-950 px-3.5 text-[14px] text-white placeholder:text-grey-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-grey-950 dark:placeholder:text-grey-400";

const REQUIRED = FIELDS.filter((f) => !f.optional);

export function LeadForm({ idPrefix = "lead", autoFocusRef, onStatusChange, renderTitle, renderSuccess }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("form");
  const attributionRef = useRef({});

  useEffect(() => {
    attributionRef.current = captureAttribution();
  }, []);

  useEffect(() => {
    onStatusChange?.(status, () => {
      setAnswers({});
      setErrors({});
      setStatus("form");
    });
  }, [status, onStatusChange]);

  const setAnswer = (id, value) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setErrors((e) => (e[id] ? { ...e, [id]: "" } : e));
  };

  const checkFormat = (field) => {
    const value = answers[field.id];
    if (isAnswered(value)) setErrors((e) => ({ ...e, [field.id]: validate(field, value) }));
  };

  const remaining = REQUIRED.filter((f) => !isAnswered(answers[f.id])).length;

  const submit = async (e) => {
    e.preventDefault();
    const found = Object.fromEntries(
      FIELDS.map((f) => [f.id, validate(f, answers[f.id])]).filter(([, message]) => message)
    );
    if (Object.keys(found).length) {
      setErrors(found);
      document.getElementById(`${idPrefix}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const { ok } = await submitLead({ answers, attribution: attributionRef.current });
      setStatus(ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  };

  if (status === "sent") return renderSuccess();

  const renderField = (field) => {
    const id = `${idPrefix}-${field.id}`;
    const value = answers[field.id];
    const error = errors[field.id];
    const describedBy = [field.hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
    const isGroup = field.type === "segments";
    const border = error
      ? "border-destructive dark:border-destructive"
      : "border-grey-800 focus-visible:border-primary dark:border-grey-800 dark:focus-visible:border-primary";

    let control;
    if (field.type === "segments") {
      control = (
        <ToggleGroup
          id={id}
          type="single"
          value={value ?? ""}
          onValueChange={(v) => v && setAnswer(field.id, v)}
          aria-labelledby={`${id}-label`}
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {field.options.map((option) => (
            <ToggleGroupItem key={option} value={option} className={cn(TOGGLE, "h-10 rounded-[10px] text-[14px] text-white")}>
              {option}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      );
    } else if (field.type === "textarea") {
      control = (
        <textarea
          id={id}
          rows={4}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => setAnswer(field.id, e.target.value)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(CONTROL, "w-full resize-y border py-2.5 outline-none", border)}
        />
      );
    } else {
      control = (
        <Input
          id={id}
          ref={field.id === FIELDS[0].id ? autoFocusRef : undefined}
          type={field.type === "email" ? "email" : "text"}
          inputMode={field.type === "url" ? "url" : undefined}
          autoComplete={field.autoComplete ?? "off"}
          required={!field.optional}
          value={value ?? ""}
          placeholder={field.placeholder}
          onChange={(e) => setAnswer(field.id, e.target.value)}
          onBlur={() => checkFormat(field)}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy}
          className={cn(CONTROL, "h-10", border)}
        />
      );
    }

    return (
      <div key={field.id} className={field.half ? "" : "sm:col-span-2"}>
        {isGroup ? (
          <span id={`${id}-label`} className="mb-2 block text-[13px] font-semibold text-white">
            {field.label}
          </span>
        ) : (
          <Label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-white">
            {field.label}
          </Label>
        )}
        {control}
        {field.hint && <p id={`${id}-hint`} className="mb-0 mt-2 text-[12.5px] text-grey-300">{field.hint}</p>}
        {error && <p id={`${id}-error`} className="mb-0 mt-1.5 text-[12.5px] font-medium text-destructive">{error}</p>}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={submit}>
      {renderTitle?.()}

      <div className="mt-6 grid gap-x-3 gap-y-6 sm:grid-cols-2">{FIELDS.map(renderField)}</div>

      {status === "failed" && (
        <p role="alert" className="mb-0 mt-5 text-[13.5px] font-medium text-destructive">
          We couldn&apos;t send your message. Check your connection and try again.
        </p>
      )}

      <Button
        type="submit"
        size="pill"
        variant={remaining > 0 ? "outline" : "brand"}
        disabled={remaining > 0 || status === "sending"}
        className={cn(
          "mt-7 h-12 w-full py-0 text-[15px]",
          remaining > 0 && "font-normal text-grey-300 disabled:opacity-100 dark:border-grey-800 dark:bg-grey-950"
        )}
      >
        {remaining > 0
          ? `${remaining} ${remaining === 1 ? "answer" : "answers"} left`
          : status === "sending"
            ? "Sending…"
            : status === "failed"
              ? "Try again"
              : site.leadForm.submitLabel}
      </Button>
    </form>
  );
}
