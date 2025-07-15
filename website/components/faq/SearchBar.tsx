'use client'
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
    const searchParams = useSearchParams()
    const pathname = usePathname();
    const { replace } = useRouter();
    const [searchValue, setSearchValue] = useState(searchParams.get('q') || '')

    const handleSearch = useDebouncedCallback((value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    const handleClear = () => {
        setSearchValue('');
        const params = new URLSearchParams(searchParams);
        params.delete('q');
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                    handleSearch(e.target.value);
                }}
                //defaultValue={searchParams.get('q')?.toString()}
                className="pl-10 rounded-xl border-gray-200 focus:border-fresh-green focus:ring-2 focus:ring-[hsla(103,38%,57%,0.2)]"
            />
            {searchValue && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
