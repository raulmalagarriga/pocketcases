-- Seed default Admin User for local development (maya@pocketcases.co / pocket2025)
DO $$
DECLARE
  admin_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'maya@pocketcases.co') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_uid,
      'authenticated',
      'authenticated',
      'maya@pocketcases.co',
      crypt('pocket2025', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Maya Stone","role":"Store Manager"}',
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_uid,
      admin_uid::text,
      format('{"sub":"%s","email":"%s"}', admin_uid::text, 'maya@pocketcases.co')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;
