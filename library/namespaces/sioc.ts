import { createNamespace } from "./namespace.ts";

export default createNamespace(
  {
    iri: "http://rdfs.org/sioc/ns#",
    prefix: "sioc:",
    terms: [
      "Community",
      "Container",
      "Forum",
      "Item",
      "Post",
      "Role",
      "Site",
      "Space",
      "Thread",
      "User",
      "UserAccount",
      "Usergroup",
      "about",
      "account_of",
      "addressed_to",
      "administrator_of",
      "attachment",
      "avatar",
      "container_of",
      "content",
      "content_encoded",
      "created_at",
      "creator_of",
      "delivered_at",
      "description",
      "discussion_of",
      "earlier_version",
      "email",
      "email_sha1",
      "embeds_knowledge",
      "feed",
      "first_name",
      "follows",
      "function_of",
      "generator",
      "group_of",
      "has_administrator",
      "has_container",
      "has_creator",
      "has_discussion",
      "has_function",
      "has_group",
      "has_host",
      "has_member",
      "has_moderator",
      "has_modifier",
      "has_owner",
      "has_parent",
      "has_part",
      "has_reply",
      "has_scope",
      "has_space",
      "has_subscriber",
      "has_usergroup",
      "host_of",
      "id",
      "ip_address",
      "last_activity_date",
      "last_item_date",
      "last_name",
      "last_reply_date",
      "later_version",
      "latest_version",
      "likes",
      "link",
      "links_to",
      "member_of",
      "mentions",
      "moderator_of",
      "modified_at",
      "modifier_of",
      "name",
      "next_by_date",
      "next_version",
      "note",
      "num_authors",
      "num_items",
      "num_replies",
      "num_threads",
      "num_views",
      "owner_of",
      "parent_of",
      "part_of",
      "previous_by_date",
      "previous_version",
      "read_at",
      "reference",
      "related_to",
      "reply_of",
      "respond_to",
      "scope_of",
      "shared_by",
      "sibling",
      "space_of",
      "subject",
      "subscriber_of",
      "title",
      "topic",
      "usergroup_of",
    ],
  } as const,
);