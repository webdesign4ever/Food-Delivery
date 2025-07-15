import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import "./globals.css";
import Link from "next/link";

export default function NotFound() {
    return (
        // <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        //     <Card className="w-full max-w-md mx-4">
        //         <CardContent className="pt-6">
        //             <div className="flex mb-4 gap-2">
        //                 <AlertCircle className="h-8 w-8 text-red-500" />
        //                 <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
        //             </div>

        //             <p className="mt-4 text-sm text-gray-600">
        //                 Did you forget to add the page to the router?
        //             </p>
        //         </CardContent>
        //     </Card>
        // </div>

        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl border-none">
                <CardContent className="pt-8 pb-10 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            404 - Page Not Found
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Oops! The page you&#39;re looking for doesn&#39;t exist or has been moved.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-block mt-6 px-6 py-3 bg-fresh-green text-white rounded-lg hover:opacity-90 transition-colors font-medium"
                    >
                        Go Back Home
                    </Link>
                </CardContent>
            </Card>
        </div>
    );
}
