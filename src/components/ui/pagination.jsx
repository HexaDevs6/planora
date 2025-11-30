import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

function PaginationRoot({ className, dir = "ltr", children, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      dir={dir}
      {...props}
    >
      {children}
    </nav>
  );
}

function PaginationContent({ className, children, ...props }) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

function PaginationItem({ children, ...props }) {
  return (
    <li data-slot="pagination-item" {...props}>
      {children}
    </li>
  );
}

function PaginationEllipsis({ className, label = "More pages", ...props }) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default function Pagination({
  page,
  total, // total items
  pageSize = 10,
  onPageChange,
  className,
  sizeWindow = 2,
  dir = "ltr",
  isLoading = false,
  labels = {
    previous: "Previous",
    next: "Next",
    morePages: "More pages",
  },
}) {
  const totalPages =
    typeof total === "number" ? Math.max(1, Math.ceil(total / pageSize)) : undefined;
  const atFirst = page <= 1;
  const atLast = totalPages ? page >= totalPages : false;

  const getPages = () => {
    if (!totalPages) return [page];
    const start = Math.max(1, page - sizeWindow);
    const end = Math.min(totalPages, page + sizeWindow);
    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pages = getPages();

  const go = (p) => {
    if (p < 1) p = 1;
    if (totalPages) p = Math.min(totalPages, p);
    if (p === page) return;
    onPageChange(p);
  };

  return (
    <PaginationRoot className={className} dir={dir}>
      <PaginationContent>
        <PaginationItem>
          <button
            onClick={() => go(1)}
            disabled={atFirst || isLoading}
            aria-label="First page"
            className={buttonVariants({ variant: "ghost", size: "default" })}
          >
            {"<<"}
          </button>
        </PaginationItem>

        <PaginationItem>
          <button
            onClick={() => go(page - 1)}
            disabled={atFirst || isLoading}
            aria-label={labels.previous}
            className={buttonVariants({ variant: "ghost", size: "default" })}
          >
            <ChevronLeftIcon />
          </button>
        </PaginationItem>

        {totalPages && pages[0] > 1 && (
          <>
            <PaginationItem>
              <button
                onClick={() => go(1)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9 flex items-center justify-center"
                )}
                disabled={isLoading}
              >
                1
              </button>
            </PaginationItem>

            {pages[0] > 2 && (
              <PaginationItem>
                <PaginationEllipsis aria-hidden label={labels.morePages} />
              </PaginationItem>
            )}
          </>
        )}

        {pages.map((p) => (
          <PaginationItem key={p}>
            <button
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                buttonVariants({
                  variant: p === page ? "outline" : "ghost",
                  size: "icon",
                }),
                "h-9 w-9 flex items-center justify-center"
              )}
              disabled={isLoading}
            >
              {p}
            </button>
          </PaginationItem>
        ))}

        {totalPages && pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis aria-hidden label={labels.morePages} />
              </PaginationItem>
            )}
            <PaginationItem>
              <button
                onClick={() => go(totalPages)}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-9 w-9 flex items-center justify-center"
                )}
                disabled={isLoading}
              >
                {totalPages}
              </button>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <button
            onClick={() => go(page + 1)}
            disabled={atLast || isLoading}
            aria-label={labels.next}
            className={buttonVariants({ variant: "ghost", size: "default" })}
          >
            <ChevronRightIcon />
          </button>
        </PaginationItem>

        <PaginationItem>
          <button
            onClick={() => (totalPages ? go(totalPages) : go(page + 1))}
            disabled={atLast || isLoading}
            aria-label="Last page"
            className={buttonVariants({ variant: "ghost", size: "default" })}
          >
            {">>"}
          </button>
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

/* named exports (in case other files import them) */
export {
  PaginationRoot as Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
};
