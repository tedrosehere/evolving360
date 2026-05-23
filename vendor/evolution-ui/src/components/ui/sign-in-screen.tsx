import * as React from "react";

import { cn } from "../../utils";

/**
 * SignInScreen — full-bleed editorial sign-in layout.
 *
 * The shared sign-in shell across Evolution apps: centered single
 * column on `bg-surface-background` with two soft teal washes and a
 * radial-faded ink dot grid for atmosphere. Apps compose the brand,
 * header copy, auth action, and footer via the sub-components.
 *
 * Spacing is baked into each sub-component's top margin so callers
 * can drop them in any order without re-discovering the recipe.
 *
 * ```tsx
 * <SignInScreen>
 *   <SignInScreenBrand logo={<img src="..." className="h-10 w-auto" />} mark="EOS" />
 *   <SignInScreenHeader
 *     eyebrow="Sign in"
 *     title={<>Welcome back<span className="text-teal">.</span></>}
 *     description="The shared operating system for all things Evolution"
 *   />
 *   <SignInScreenAction>
 *     <Button variant="secondary" size="lg" className="w-full">Sign in with Google</Button>
 *   </SignInScreenAction>
 *   <SignInScreenDivider>Need access?</SignInScreenDivider>
 *   <SignInScreenFooterText>
 *     Reach out to <a href="mailto:support@evolution.team">support@evolution.team</a>.
 *   </SignInScreenFooterText>
 *   <SignInScreenTerms>
 *     By signing in, you agree to our <a href="...">Terms</a>.
 *   </SignInScreenTerms>
 * </SignInScreen>
 * ```
 */
const SignInScreen = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, children, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(
      "relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-surface-background px-6 py-16 sm:px-10",
      className,
    )}
    {...props}
  >
    {/* Atmospheric teal washes */}
    <div
      aria-hidden
      className="pointer-events-none absolute -top-48 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-teal-tint blur-3xl"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -bottom-56 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-teal-light opacity-60 blur-3xl"
    />
    {/* Editorial ink dot grid, radial-masked toward the edges */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(var(--eu-ink)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
    />

    <div className="relative flex w-full max-w-md flex-col items-center text-center">
      {children}
    </div>
  </main>
));
SignInScreen.displayName = "SignInScreen";

type SignInScreenBrandProps = React.HTMLAttributes<HTMLDivElement> & {
  /** Logo node — typically an <img> or framework Image, sized ~h-10. */
  logo: React.ReactNode;
  /** Optional brand mark in teal next to the logo, e.g. "EOS". */
  mark?: React.ReactNode;
};

const SignInScreenBrand = React.forwardRef<
  HTMLDivElement,
  SignInScreenBrandProps
>(({ className, logo, mark, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center gap-3", className)}
    {...props}
  >
    {logo}
    {mark != null && (
      <>
        <span className="h-5 w-px bg-separator" />
        <span className="eyebrow text-teal">{mark}</span>
      </>
    )}
  </div>
));
SignInScreenBrand.displayName = "SignInScreenBrand";

type SignInScreenHeaderProps = Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> & {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
};

const SignInScreenHeader = React.forwardRef<
  HTMLElement,
  SignInScreenHeaderProps
>(
  (
    { className, eyebrow, title, description, children, ...props },
    ref,
  ) => (
    <header
      ref={ref}
      className={cn(
        "mt-12 flex flex-col items-center gap-5",
        className,
      )}
      {...props}
    >
      {eyebrow != null && <span className="eyebrow">{eyebrow}</span>}
      {title != null && (
        <h1 className="m-0 max-w-[14ch] !leading-[1.05] tracking-tight">
          {title}
        </h1>
      )}
      {description != null && (
        <p className="text-lg text-secondary m-0 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {children}
    </header>
  ),
);
SignInScreenHeader.displayName = "SignInScreenHeader";

/**
 * SignInScreenAction — surface-backed wrapper for the auth button(s).
 *
 * The opaque `bg-surface` panel keeps the dot grid from showing through
 * the secondary button's translucent hover overlay. Sized to its child
 * so the radius lines up with the button's `--eu-radius-lg`.
 */
const SignInScreenAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative mt-8 w-full rounded-[var(--eu-radius-lg)] bg-surface",
      className,
    )}
    {...props}
  />
));
SignInScreenAction.displayName = "SignInScreenAction";

const SignInScreenDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mt-12 flex w-full items-center gap-3", className)}
    {...props}
  >
    <span className="h-px flex-1 bg-separator" />
    {children != null && <span className="eyebrow">{children}</span>}
    <span className="h-px flex-1 bg-separator" />
  </div>
));
SignInScreenDivider.displayName = "SignInScreenDivider";

const SignInScreenFooterText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mt-5 text-sm text-secondary", className)}
    {...props}
  />
));
SignInScreenFooterText.displayName = "SignInScreenFooterText";

const SignInScreenTerms = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("caption mt-12 max-w-xs", className)}
    {...props}
  />
));
SignInScreenTerms.displayName = "SignInScreenTerms";

export {
  SignInScreen,
  SignInScreenBrand,
  SignInScreenHeader,
  SignInScreenAction,
  SignInScreenDivider,
  SignInScreenFooterText,
  SignInScreenTerms,
};
