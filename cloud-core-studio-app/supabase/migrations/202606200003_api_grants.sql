grant usage on schema public to anon, authenticated;

grant select on
  public.locations,
  public.rooms,
  public.class_categories,
  public.cancellation_policies,
  public.instructors,
  public.membership_plans,
  public.class_sessions,
  public.bookings,
  public.waitlist_entries,
  public.announcements,
  public.legal_documents
to anon, authenticated;

grant select, insert, update on
  public.profiles
to authenticated;

grant select on
  public.roles,
  public.members,
  public.memberships,
  public.class_passes,
  public.notifications,
  public.payments
to authenticated;

grant execute on function public.book_class(uuid) to authenticated;
grant execute on function public.book_class(uuid, uuid) to authenticated;
grant execute on function public.join_waitlist(uuid) to authenticated;
