import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MentorCard({ mentor }) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <h3 className="text-xl font-semibold">
          {mentor.name}
        </h3>

        <p>{mentor.title}</p>

        <p>
          Rating: {mentor.averageRating}
        </p>

        <p>
          ${mentor.hourlyRate}/hr
        </p>

        <Button asChild>
          <Link to={`/mentors/${mentor._id}`}>
            View Profile
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}