import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const withAuth = (Component: any) => {
    const AuthenticatedComponent = (props: any) => {
        const router = useRouter();
        const { user } = useAuth();

        if (!user.uid) {
            router.push("/");
            return null;
        }

        return <Component {...props} />;
    };

    return AuthenticatedComponent;
};

export default withAuth;
