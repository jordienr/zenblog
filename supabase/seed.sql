SET session_replication_role = replica;

pg_dump: warning: there are circular foreign-key constraints on this table:
pg_dump: detail: key
pg_dump: hint: You might not be able to restore the dump without using --disable-triggers or temporarily dropping the constraints.
pg_dump: hint: Consider using a full dump instead of a --data-only dump to avoid this problem.
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.5 (Ubuntu 15.5-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
        ('00000000-0000-0000-0000-000000000000', 'eb2da736-be5e-4598-81de-3315674e398d', '{"action":"user_confirmation_requested","actor_id":"a49658c5-b57d-4ba5-bf74-5666a9101917","actor_username":"jordi@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-03-05 00:17:55.443109+00', ''),
        ('00000000-0000-0000-0000-000000000000', 'af12c60a-0543-4888-af0a-292365b90c9c', '{"action":"user_signedup","actor_id":"a49658c5-b57d-4ba5-bf74-5666a9101917","actor_username":"jordi@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-03-05 00:18:09.084507+00', ''),
        ('00000000-0000-0000-0000-000000000000', '012bd42d-12b8-4d54-85a5-a58fd973318b', '{"action":"login","actor_id":"a49658c5-b57d-4ba5-bf74-5666a9101917","actor_username":"jordi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-03-05 00:18:15.936182+00', ''),
        ('00000000-0000-0000-0000-000000000000', '5612f1e9-8e8d-4433-9693-a91838af82cc', '{"action":"login","actor_id":"a49658c5-b57d-4ba5-bf74-5666a9101917","actor_username":"jordi@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-03-05 00:18:52.28643+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method") VALUES
        ('bbb177fd-7477-4571-9dba-1478f405d58b', 'a49658c5-b57d-4ba5-bf74-5666a9101917', 'e4ebd130-8509-410c-9e21-83ca68870053', 's256', 'MGBXpFrapVpDRkpVZjNdIsXEBCXpJWELBqd71ob_U9Q', 'email', '', '', '2024-03-05 00:17:55.444055+00', '2024-03-05 00:17:55.444055+00', 'email/signup');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at") VALUES
        ('00000000-0000-0000-0000-000000000000', 'a49658c5-b57d-4ba5-bf74-5666a9101917', 'authenticated', 'authenticated', 'jordi@gmail.com', '$2a$10$qhmY3MbVYEEdtef/Op4cqOo/4Ni4n4xRMW4yCY8pYf/d7eHRVPkbu', '2024-03-05 00:18:09.085532+00', NULL, '', '2024-03-05 00:17:55.4447+00', '', NULL, '', '', NULL, '2024-03-05 00:18:52.288168+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-03-05 00:17:55.434241+00', '2024-03-05 00:18:52.29079+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
        ('a49658c5-b57d-4ba5-bf74-5666a9101917', 'a49658c5-b57d-4ba5-bf74-5666a9101917', '{"sub": "a49658c5-b57d-4ba5-bf74-5666a9101917", "email": "jordi@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2024-03-05 00:17:55.441584+00', '2024-03-05 00:17:55.44178+00', '2024-03-05 00:17:55.44178+00', 'fddf68e3-5d1a-4e9e-a518-6724b3c50e08');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
        ('bf3aa832-7419-4023-85dd-09d92742b5e8', 'a49658c5-b57d-4ba5-bf74-5666a9101917', '2024-03-05 00:18:15.936867+00', '2024-03-05 00:18:15.936867+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', '192.168.117.1', NULL),
        ('0e6b8c25-16eb-4f32-9a12-3bf05c2bc7b2', 'a49658c5-b57d-4ba5-bf74-5666a9101917', '2024-03-05 00:18:52.288341+00', '2024-03-05 00:18:52.288341+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36', '192.168.117.1', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
        ('bf3aa832-7419-4023-85dd-09d92742b5e8', '2024-03-05 00:18:15.94131+00', '2024-03-05 00:18:15.94131+00', 'password', '61c6afba-3c56-44c3-868d-e3a5ef0f7d3a'),
        ('0e6b8c25-16eb-4f32-9a12-3bf05c2bc7b2', '2024-03-05 00:18:52.291097+00', '2024-03-05 00:18:52.291097+00', 'password', 'b8f3f531-def6-4e21-90bf-54f7a65437b7');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
        ('00000000-0000-0000-0000-000000000000', 1, 'nLBR0XyCLL0jHRJ3CqWLxA', 'a49658c5-b57d-4ba5-bf74-5666a9101917', false, '2024-03-05 00:18:15.938685+00', '2024-03-05 00:18:15.938685+00', NULL, 'bf3aa832-7419-4023-85dd-09d92742b5e8'),
        ('00000000-0000-0000-0000-000000000000', 2, '7KUspHoB8oKft1LTk_0hVA', 'a49658c5-b57d-4ba5-bf74-5666a9101917', false, '2024-03-05 00:18:52.289442+00', '2024-03-05 00:18:52.289442+00', NULL, '0e6b8c25-16eb-4f32-9a12-3bf05c2bc7b2');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: blogs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."blogs" ("id", "created_at", "title", "emoji", "user_id", "description", "public_id") VALUES
        ('673a21e5-145f-4c7f-815d-5627ac681f8e', '2024-03-05 00:19:59.145301+00', 'my blog', '📝', 'a49658c5-b57d-4ba5-bf74-5666a9101917', '', 'ae1f8438-8acd-44ac-9bfc-931de82a5f6b');


--
-- Data for Name: blog_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: feedback; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: homepage_signup; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."posts" ("created_at", "user_id", "blog_id", "title", "published", "content", "updated_at", "slug", "id", "cover_image", "metadata", "deleted") VALUES
        ('2024-03-05 00:20:12.55528+00', 'a49658c5-b57d-4ba5-bf74-5666a9101917', '673a21e5-145f-4c7f-815d-5627ac681f8e', 'cool post', false, '{"type": "doc", "content": [{"type": "paragraph"}]}', '2024-03-05 00:20:12.55528+00', 'cool-post', '9c9868a9-25ac-43bf-a900-c3e7af332e0e', '', '{}', false);


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prices" ("id", "created_at", "price", "stripe_price_id") VALUES
        (1, '2024-03-05 00:13:41.724809+00', '{"id": "price_1OjWqnJfDYgxbs7ZTx9uUklY", "type": "recurring", "active": true, "object": "price", "created": 1707872485, "product": "prod_PXkoPOxUafT0Ig", "currency": "usd", "livemode": false, "metadata": {}, "nickname": null, "recurring": {"interval": "year", "usage_type": "licensed", "interval_count": 1, "aggregate_usage": null, "trial_period_days": null}, "lookup_key": "pro_yearly", "tiers_mode": null, "unit_amount": 6900, "tax_behavior": "unspecified", "billing_scheme": "per_unit", "custom_unit_amount": null, "transform_quantity": null, "unit_amount_decimal": "6900"}', 'price_1OjWqnJfDYgxbs7ZTx9uUklY');


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "created_at", "product", "stripe_product_id") VALUES
        (1, '2024-03-05 00:13:40.948122+00', '{"id": "prod_PXkoPOxUafT0Ig", "url": null, "name": "Pro plan", "type": "service", "active": true, "images": [], "object": "product", "created": 1707666659, "updated": 1709463616, "features": [], "livemode": false, "metadata": {}, "tax_code": "txcd_10000000", "shippable": null, "attributes": [], "unit_label": null, "description": "The zenblog pro plan, perfect for solo devs and entrepreneurs.", "default_price": "price_1OjWqnJfDYgxbs7ZTx9uUklY", "package_dimensions": null, "statement_descriptor": null}', 'prod_PXkoPOxUafT0Ig');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."subscriptions" ("created_at", "user_id", "status", "stripe_subscription_id", "subscription") VALUES
        ('2024-03-05 00:18:40.547732+00', 'a49658c5-b57d-4ba5-bf74-5666a9101917', 'active', 'sub_1OqliLJfDYgxbs7ZFySuoJA2', '{"id": "sub_1OqliLJfDYgxbs7ZFySuoJA2", "plan": {"id": "price_1OjWqnJfDYgxbs7ZTx9uUklY", "active": true, "amount": 6900, "object": "plan", "created": 1707872485, "product": "prod_PXkoPOxUafT0Ig", "currency": "usd", "interval": "year", "livemode": false, "metadata": {}, "nickname": null, "tiers_mode": null, "usage_type": "licensed", "amount_decimal": "6900", "billing_scheme": "per_unit", "interval_count": 1, "aggregate_usage": null, "transform_usage": null, "trial_period_days": null}, "items": {"url": "/v1/subscription_items?subscription=sub_1OqliLJfDYgxbs7ZFySuoJA2", "data": [{"id": "si_Pg7yY19RdaKZn8", "plan": {"id": "price_1OjWqnJfDYgxbs7ZTx9uUklY", "active": true, "amount": 6900, "object": "plan", "created": 1707872485, "product": "prod_PXkoPOxUafT0Ig", "currency": "usd", "interval": "year", "livemode": false, "metadata": {}, "nickname": null, "tiers_mode": null, "usage_type": "licensed", "amount_decimal": "6900", "billing_scheme": "per_unit", "interval_count": 1, "aggregate_usage": null, "transform_usage": null, "trial_period_days": null}, "price": {"id": "price_1OjWqnJfDYgxbs7ZTx9uUklY", "type": "recurring", "active": true, "object": "price", "created": 1707872485, "product": "prod_PXkoPOxUafT0Ig", "currency": "usd", "livemode": false, "metadata": {}, "nickname": null, "recurring": {"interval": "year", "usage_type": "licensed", "interval_count": 1, "aggregate_usage": null, "trial_period_days": null}, "lookup_key": "pro_yearly", "tiers_mode": null, "unit_amount": 6900, "tax_behavior": "unspecified", "billing_scheme": "per_unit", "custom_unit_amount": null, "transform_quantity": null, "unit_amount_decimal": "6900"}, "object": "subscription_item", "created": 1709597917, "metadata": {}, "quantity": 1, "tax_rates": [], "subscription": "sub_1OqliLJfDYgxbs7ZFySuoJA2", "billing_thresholds": null}], "object": "list", "has_more": false, "total_count": 1}, "object": "subscription", "status": "active", "created": 1709597917, "currency": "usd", "customer": "cus_Pg7yrD9WwB1SRM", "discount": null, "ended_at": null, "livemode": false, "metadata": {}, "quantity": 1, "schedule": null, "cancel_at": null, "trial_end": null, "start_date": 1709597917, "test_clock": null, "application": null, "canceled_at": null, "description": null, "trial_start": null, "on_behalf_of": null, "automatic_tax": {"enabled": false, "liability": null}, "transfer_data": null, "days_until_due": null, "default_source": null, "latest_invoice": "in_1OqliLJfDYgxbs7ZG750ga7A", "pending_update": null, "trial_settings": {"end_behavior": {"missing_payment_method": "create_invoice"}}, "invoice_settings": {"issuer": {"type": "self"}, "account_tax_ids": null}, "pause_collection": null, "payment_settings": {"payment_method_types": null, "payment_method_options": {"card": {"network": null, "request_three_d_secure": "automatic"}, "konbini": null, "acss_debit": null, "bancontact": null, "us_bank_account": null, "customer_balance": null}, "save_default_payment_method": "off"}, "collection_method": "charge_automatically", "default_tax_rates": [], "billing_thresholds": null, "current_period_end": 1741133917, "billing_cycle_anchor": 1709597917, "cancel_at_period_end": false, "cancellation_details": {"reason": null, "comment": null, "feedback": null}, "current_period_start": 1709597917, "pending_setup_intent": null, "default_payment_method": "pm_1OqliKJfDYgxbs7ZWUdKewWy", "application_fee_percent": null, "billing_cycle_anchor_config": null, "pending_invoice_item_interval": null, "next_pending_invoice_item_invoice": null}');


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
        ('images', 'images', NULL, '2024-03-05 00:20:57.175142+00', '2024-03-05 00:20:57.175142+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 2, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: feedback_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."feedback_id_seq"', 1, false);


--
-- Name: homepage_signup_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."homepage_signup_id_seq"', 1, false);


--
-- Name: post_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."post_tags_id_seq"', 1, false);


--
-- Name: prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."prices_id_seq"', 1, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."products_id_seq"', 1, true);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."teams_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;