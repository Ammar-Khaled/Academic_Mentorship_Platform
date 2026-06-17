import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getMentor,
  getPublicMentorAvailability,
} from "@/api/mentor";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AvailabilitySection } from "./components/AvailabilitySection";

export function PublicMentorProfilePage() {
  const { id } = useParams();

  const [mentor, setMentor] = useState(null);
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      const mentorData = await getMentor(id);
      const availabilityData =
        await getPublicMentorAvailability(id);

      setMentor(mentorData);
      setAvailability(availabilityData);
    } catch (error) {
      console.error(error);
    }
  }

  if (!mentor) {
    return (
      <div className="flex justify-center py-20">
        Loading mentor...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">

      {/* Hero Section */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold">
                  {mentor.name}
                </h1>

                <p className="mt-2 text-lg text-muted-foreground">
                  {mentor.title}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  ⭐ {mentor.averageRating}
                </Badge>

                {mentor.isVerified && (
                  <Badge>
                    Verified Mentor
                  </Badge>
                )}

                <Badge variant="outline">
                  ${mentor.hourlyRate}/hr
                </Badge>
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold">
                ${mentor.hourlyRate}
              </div>

              <div className="text-sm text-muted-foreground">
                per hour
              </div>

              <Button className="mt-4 w-full">
                Book Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardContent className="p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            About
          </h2>

          <p className="leading-7 text-muted-foreground">
            {mentor.bio}
          </p>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardContent className="p-8">
          <h2 className="mb-4 text-2xl font-semibold">
            Technical Stack
          </h2>

          <Badge className="text-sm px-4 py-2">
            {mentor.stack?.name ?? mentor.stack}
          </Badge>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardContent className="p-8">
          <h2 className="mb-6 text-2xl font-semibold">
            Available Time Slots
          </h2>

          <AvailabilitySection
            availability={availability}
          />
        </CardContent>
      </Card>

    </div>
  );
}

export default PublicMentorProfilePage;