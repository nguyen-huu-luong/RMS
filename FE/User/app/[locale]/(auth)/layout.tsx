export default function LoginLayout({
    children,
    params
  }: {
    children: React.ReactNode,
    params: {
        locale: string
      }
  }) {
    return <section>{children}</section>
  } 