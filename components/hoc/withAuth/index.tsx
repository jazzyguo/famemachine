import { useRouter } from "next/router";
import { useAuthContext } from "@/contexts/AuthContext";

const withAuth = (Component: any) => {
    const AuthenticatedComponent = (props: any) => {
        const router = useRouter();
        const { user } = useAuthContext();

        if (!user) {
            router.push("/");
            return null;
        }

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
