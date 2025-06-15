import { z } from "zod";

export const DefinitionSchema = z.object({
  definition: z.string(),
  example: z.string().nullable(),
});
export type Definition = z.infer<typeof DefinitionSchema>;

export const MeaningSchema = z.object({
  partOfSpeech: z.string(),
  definitions: z.array(DefinitionSchema),
});
export type Meaning = z.infer<typeof MeaningSchema>;

export const WordSchema = z.object({
  word: z.string(),
  origin: z.string().nullable(),
  meanings: z.array(MeaningSchema).nullable(),
});
export type Word = z.infer<typeof WordSchema>;

export const OriginSchema = z.object({
  word: WordSchema,
  totalTracks: z.number(),
  trackIndex: z.number(),
});
export type Origin = z.infer<typeof OriginSchema>;

export const TrackSchema = z.object({
  id: z.number(),
  title: z.string(),
  fullTitle: z.string(),
  artist: z.string(),
  preview: z.string(),
  albumTitle: z.string(),
  coverUrl: z.string(),
  origin: OriginSchema,
});
export type Track = z.infer<typeof TrackSchema>;

export const MashedTrack = z.object({
  title: z.string(),
  artist: z.string(),
  albumTitle: z.string(),
});
export type MashedTrack = z.infer<typeof MashedTrack>;

export const MashupSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  track1: TrackSchema,
  track2: TrackSchema,
  mashedTrack: MashedTrack,
});
export type Mashup = z.infer<typeof MashupSchema>;
