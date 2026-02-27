export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
```

Click **Commit new file**

---

Your repo should now look like:
```
digest-frontend/
├── app/
│   ├── layout.js    ← new file
│   └── page.js
└── package.json
