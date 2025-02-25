import { ObjectType, Field, Int, registerEnumType } from 'type-graphql';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Chapter } from './Chapter';
import { EventSponsor } from './EventSponsor';
import { Rsvp } from './Rsvp';
import { Tag } from './Tag';
import { UserEventRole } from './UserEventRole';
import { Venue } from './Venue';

export enum VenueType {
  Physical = 'Physical',
  Online = 'Online',
  PhysicalAndOnline = 'PhysicalAndOnline',
}

registerEnumType(VenueType, {
  name: 'VenueType',
  description: 'All possible venue types for an event',
});

@ObjectType()
@Entity({ name: 'events' })
export class Event extends BaseModel {
  @Field(() => String)
  @Column({ nullable: false })
  name!: string;

  @Field(() => String)
  @Column({ nullable: false })
  description!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  url?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  streaming_url?: string;

  @Field(() => VenueType)
  @Column({ type: 'enum', enum: VenueType, default: VenueType.Physical })
  venue_type!: VenueType;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  start_at!: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  ends_at!: Date;

  @Field(() => Boolean)
  @Column({ default: false })
  canceled!: boolean;

  @Field(() => Int)
  @Column({ nullable: false })
  capacity!: number;

  @Field(() => Boolean)
  @Column({ default: false })
  invite_only!: boolean;

  @Field(() => [EventSponsor])
  @OneToMany((_type) => EventSponsor, (eventSponsor) => eventSponsor.sponsor, {
    onDelete: 'CASCADE',
  })
  sponsors!: EventSponsor[];

  @Field(() => Venue, { nullable: true })
  @ManyToOne((_type) => Venue, (venue) => venue.events, { nullable: true })
  @JoinColumn({ name: 'venue_id' })
  venue?: Venue;

  @Field(() => Chapter)
  @ManyToOne((_type) => Chapter, (chapter) => chapter.events)
  @JoinColumn({ name: 'chapter_id' })
  chapter!: Chapter;

  @Field(() => [Rsvp])
  @OneToMany((_type) => Rsvp, (rsvp) => rsvp.event, { onDelete: 'CASCADE' })
  rsvps!: Rsvp[];

  @Field(() => [Tag], { nullable: true })
  @OneToMany((_type) => Tag, (tag) => tag.event, { onDelete: 'CASCADE' })
  tags!: Tag[];

  @Field(() => [UserEventRole])
  @OneToMany((_type) => UserEventRole, (UserEventRole) => UserEventRole.event)
  user_roles!: UserEventRole[];

  @Field(() => String)
  @Column({ nullable: false })
  image_url!: string;

  constructor(params: {
    name: string;
    description: string;
    url?: string;
    streaming_url?: string;
    venue_type: VenueType;
    start_at: Date;
    ends_at: Date;
    canceled?: boolean;
    capacity: number;
    venue?: Venue;
    chapter: Chapter;
    invite_only?: boolean;
    user_roles: UserEventRole[];
    image_url: string;
  }) {
    super();
    if (params) {
      const {
        name,
        description,
        url,
        streaming_url,
        venue_type,
        start_at,
        ends_at,
        canceled,
        capacity,
        venue,
        chapter,
        invite_only,
        user_roles,
        image_url,
      } = params;

      this.name = name;
      this.description = description;
      this.url = url;
      this.streaming_url = streaming_url;
      this.venue_type = venue_type;
      this.start_at = start_at;
      this.ends_at = ends_at;
      this.canceled = canceled || false;
      this.capacity = capacity;
      this.venue = venue;
      this.chapter = chapter;
      this.invite_only = invite_only || false;
      this.user_roles = user_roles;
      this.image_url = image_url;
    }
  }
}
