"use client";;
import * as React from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CHOICE_MAX_AGE = 400 * 24 * 60 * 60;
function saveChoice(accepted) {
  document.cookie = `cookieConsent=${accepted}; max-age=${CHOICE_MAX_AGE}; path=/`;
}

const CookieConsent = React.forwardRef((
  {
    variant = "default",
    demo = false,
    onAcceptCallback = () => {},
    onDeclineCallback = () => {},
    className,
    description = "We use cookies to give you the best experience on our site.",
    learnMoreHref = "/privacy-policy",
    ...props
  },
  ref,
) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hide, setHide] = React.useState(false);

  const handleAccept = React.useCallback(() => {
    setIsOpen(false);
    saveChoice(true);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback();
  }, [onAcceptCallback]);

  const handleDecline = React.useCallback(() => {
    setIsOpen(false);
    saveChoice(false);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback();
  }, [onDeclineCallback]);

  React.useEffect(() => {
    try {
      setIsOpen(true);
      const stored = document.cookie.match(/(?:^|;\s*)cookieConsent=(true|false)(?:;|$)/);
      if (stored && !demo) {
        saveChoice(stored[1] === "true");
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      }
    } catch (error) {
      console.warn("Cookie consent error:", error);
    }
  }, [demo]);

  if (hide) return null;

  const containerClasses = cn(
    "fixed z-50 transition-all duration-700",
    !isOpen ? "translate-y-full opacity-0" : "translate-y-0 opacity-100",
    className
  );

  const commonWrapperProps = {
    ref,
    className: cn(containerClasses, variant === "mini"
      ? "left-0 right-0 sm:left-4 bottom-4 w-full sm:max-w-3xl"
      : "bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 w-full sm:max-w-md"),
    ...props,
  };

  if (variant === "default") {
    return (
      <div {...commonWrapperProps}>
        <Card className="m-3 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">We use cookies</CardTitle>
            <Cookie className="h-5 w-5" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
            <p className="text-xs text-fg-muted">
              By clicking <span className="font-medium">&ldquo;Accept&rdquo;</span>, you
              agree to our use of cookies.
            </p>
            <a
              href={learnMoreHref}
              className="text-xs text-oklch(0.205 0 0) underline underline-offset-4 hover:no-underline dark:text-oklch(0.922 0 0)">
              Learn more
            </a>
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            <Button onClick={handleDecline} variant="secondary" className="flex-1">
              Decline
            </Button>
            <Button onClick={handleAccept} className="flex-1">
              Accept
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (variant === "small") {
    return (
      <div {...commonWrapperProps}>
        <Card className="m-3 shadow-lg">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2 h-0 px-4">
            <CardTitle className="text-base">We use cookies</CardTitle>
            <Cookie className="h-4 w-4" />
          </CardHeader>
          <CardContent className="pt-0 pb-2 px-4">
            <CardDescription className="text-sm">
              {description}
            </CardDescription>
          </CardContent>
          <CardFooter className="flex gap-2 h-0 py-2 px-4">
            <Button
              onClick={handleDecline}
              variant="secondary"
              size="sm"
              className="flex-1 rounded-full">
              Decline
            </Button>
            <Button onClick={handleAccept} size="sm" className="flex-1 rounded-full">
              Accept
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (variant === "mini") {
    return (
      <div {...commonWrapperProps}>
        <div className="mx-3 flex flex-col gap-2 rounded-2xl border border-white/10 bg-grey-900/70 px-3.5 py-2.5 text-white shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:px-4 sm:py-3">
          <p className="flex-1 text-[11px] leading-snug text-white/70 sm:text-sm sm:leading-normal">
            {description}{" "}
            See our{" "}
            <a href={learnMoreHref} className="text-white underline underline-offset-2 hover:no-underline">
              Cookie Policy
            </a>
            .
          </p>
          <div className="flex items-center gap-2 sm:justify-end">
            <Button
              onClick={handleDecline}
              variant="brandGhost"
              size="sm"
              className="h-8 flex-1 rounded-full px-4 text-xs sm:flex-none">
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              variant="brand"
              size="sm"
              className="h-8 flex-1 rounded-full px-4 text-xs sm:flex-none">
              Accept
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

CookieConsent.displayName = "CookieConsent";
export { CookieConsent };
