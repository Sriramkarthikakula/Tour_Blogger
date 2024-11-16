
<body>
  <h1>Blog Website with Next.js and Supabase</h1>
  <p>This is a simple blog website built using <strong>Next.js</strong> and <strong>Supabase</strong>, where users can sign up, sign in, select a country, add their blogs, and view blogs from other users in the same country. The admin has special privileges to manage blogs from all users, including viewing, editing, and deleting blogs.</p>

  <h2>Features</h2>
  <ul>
    <li><strong>User Authentication:</strong>
      <ul>
        <li>Users can sign up and sign in using email and password.</li>
        <li>Admin login through predefined credentials.</li>
      </ul>
    </li>
    <li><strong>Country-based Blog System:</strong>
      <ul>
        <li>Users can select a country when signing up or signing in.</li>
        <li>Users can add their own blogs and view blogs from other users in the same country.</li>
      </ul>
    </li>
    <li><strong>Admin Panel:</strong>
      <ul>
        <li>Admin can log in using specific credentials and manage blogs.</li>
        <li>Admin can select a country to view, add, edit, and delete blogs from any user.</li>
        <h2>Admin Credentials</h2>
  <ul>
    <li><strong>Email:</strong> admin1420@gmail.com</li>
    <li><strong>Password:</strong> 123456</li>
  </ul>
      </ul>
    </li>
  </ul>

  <h2>Tech Stack</h2>
  <ul>
    <li><strong>Frontend:</strong>
      <ul>
        <li><strong>Next.js</strong> (React framework for building the application)</li>
        <li><strong>Tailwind CSS</strong> (for styling the frontend)</li>
      </ul>
    </li>
    <li><strong>Backend:</strong>
      <ul>
        <li><strong>Supabase</strong> (for authentication, database, and storage)</li>
      </ul>
    </li>
  </ul>

  <h2>Installation</h2>
  <h3>Prerequisites</h3>
  <ul>
    <li><strong>Node.js</strong> (>= 14.0.0)</li>
    <li><strong>Supabase account</strong> (for backend services)</li>
  </ul>

  <h3>Steps to Run Locally</h3>
  <ol>
    <li><strong>Clone this repository:</strong>
      <pre><code>git clone https://github.com/yourusername/blog-website.git
cd blog-website</code></pre>
    </li>
    <li><strong>Install dependencies:</strong>
      <pre><code>npm install</code></pre>
    </li>
    <li><strong>Set up Supabase:</strong>
      <ul>
        <li>Create a Supabase account at <a href="https://supabase.io">https://supabase.io</a>.</li>
        <li>Create a new project in Supabase and configure the database.</li>
        <li>Set up authentication and make sure to enable email/password sign-ups.</li>
        <li>Add the Supabase keys and URL in the <code>.env.local</code> file in the project root:
          <pre><code>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</code></pre>
        </li>
      </ul>
    </li>
    <li><strong>Run the development server:</strong>
      <pre><code>npm run dev</code></pre>
      <p>Your app should now be running at <a href="http://localhost:3000">http://localhost:3000</a>.</p>
    </li>
  </ol>

  <h2>Admin Credentials</h2>
  <ul>
    <li><strong>Email:</strong> admin1420@gmail.com</li>
    <li><strong>Password:</strong> 123456</li>
  </ul>
  <p>The admin user has the ability to manage all blogs in the system. The admin can view, add, edit, and delete blogs from any user in the selected country.</p>

  <h2>Features Walkthrough</h2>

  <h3>User Features</h3>
  <ul>
    <li><strong>Sign Up/Sign In:</strong>
      <ul>
        <li>Users can create an account or sign in using email and password.</li>
        <li>After signing in, users can select a country and add blogs related to that country.</li>
      </ul>
    </li>
    <li><strong>View Blogs:</strong>
      <ul>
        <li>After selecting a country, users can view blogs written by other users from the same country.</li>
      </ul>
    </li>
  </ul>

  <h3>Admin Features</h3>
  <ul>
    <li><strong>Admin Login:</strong>
      <ul>
        <li>Admin can log in using the predefined credentials and manage all user blogs.</li>
      </ul>
    </li>
    <li><strong>Manage Blogs:</strong>
      <ul>
        <li>Admin can view blogs from any country, add new blogs, edit existing blogs, and delete blogs.</li>
      </ul>
    </li>
  </ul>
</body>
</html>
