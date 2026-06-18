import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { MentorCard } from "./components/MentorCard";
import { useMentors } from "./hooks/useMentors";

export function MentorDiscoveryPage() {
  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    mentors,
    total,
    loading,
  } = useMentors({
    page,
    keyword,
    sortBy,
  });

  const totalPages =
    Math.ceil(total / 6);

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <section className="rounded-2xl border bg-card p-8">
        <h1 className="text-5xl font-bold">
          Find Your Next Mentor
        </h1>

        <p className="mt-4 text-muted-foreground">
          Browse expert mentors for code reviews,
          interviews, pair programming and career advice.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <Input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search mentor..."
          />

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value)
            }
            className="h-10 rounded-md border bg-background px-3"
          >
            <option value="rating">
              Highest Rating
            </option>

            <option value="price">
              Lowest Price
            </option>
          </select>

        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">
              {total}
            </div>

            <div className="text-muted-foreground text-sm">
              Available Mentors
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">
              45 min
            </div>

            <div className="text-muted-foreground text-sm">
              Session Duration
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold">
              ⭐ 4.8+
            </div>

            <div className="text-muted-foreground text-sm">
              Top Rated Experts
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          Loading mentors...
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mentors.map((mentor) => (
              <MentorCard
                key={mentor._id}
                mentor={mentor}
              />
            ))}
          </div>

          {mentors.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center">
                No mentors found.
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-center gap-4">

            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() =>
                setPage((p) => p - 1)
              }
            >
              Previous
            </Button>

            <span>
              Page {page} of {totalPages || 1}
            </span>

            <Button
              variant="outline"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage((p) => p + 1)
              }
            >
              Next
            </Button>

          </div>
        </>
      )}
    </div>
  );
}

export default MentorDiscoveryPage;