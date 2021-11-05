import React, { useState, useEffect } from "react";
import { firstValueFrom } from "rxjs";

import { createLocalizedActorResource, ActorInterface } from "../store";
import { Grid, Typography } from "@mui/material";

type ActorProps = {
  actorIri: string;
  language: string;
};

export const Actor: React.FC<ActorProps> = ({ actorIri, language }) => {
  const [actor, setActor] = useState<ActorInterface | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setActor(null);
      const result = await firstValueFrom(
        createLocalizedActorResource(language).findByIris([actorIri])
      );
      setActor(result[0]);
    };
    fetchData();
  }, [setActor, actorIri, language]);

  if (!actor) {
    return <>Loading...</>;
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h2">{actor.name}</Typography>
        <Typography>
          Born {actor.birthDate.toLocaleDateString()} as {actor.birthName}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography>{actor.abstract}</Typography>
      </Grid>
      <Grid item xs={4}>
        <img src={actor.thumbnail} />
      </Grid>
    </Grid>
  );
};
