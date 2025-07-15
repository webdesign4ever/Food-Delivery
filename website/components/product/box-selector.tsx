import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Apple, Package } from "lucide-react";
import type { BoxType } from "@/lib/types";

interface BoxSelectorProps {
  boxTypes: BoxType[];
  onSelectBox: (box: BoxType) => void;
}

export default function BoxSelector({ boxTypes, onSelectBox }: BoxSelectorProps) {
  const getIcon = (index: number) => {
    switch (index) {
      case 0: return <Leaf className="text-white w-8 h-8" />;
      case 1: return <Apple className="text-white w-8 h-8" />;
      case 2: return <Package className="text-white w-8 h-8" />;
      default: return <Package className="text-white w-8 h-8" />;
    }
  };

  const getColorClass = (index: number) => {
    return index === 1 ? 'text-sunny-yellow' : 'text-fresh-green';
  };

  const getBgColorClass = (index: number) => {
    return index === 1 ? 'bg-sunny-yellow' : 'bg-fresh-green';
  };

  const getBgTintClass = (index: number) => {
    return index === 1 ? 'bg-light-yellow-tint' : 'bg-light-green-tint';
  };

  const getBorderClass = (index: number) => {
    return index === 1 ? 'border-2 border-sunny-yellow' : '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-dark-text mb-4">Choose Your Box Size</h2>
        <p className="text-gray-600">Select the perfect size for your household needs</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {boxTypes.map((box, index) => (
          <Card
            key={box.id}
            className={`relative overflow-hidden hover:shadow-xl transition-all group cursor-pointer ${getBgTintClass(index)} ${getBorderClass(index)}`}
            onClick={() => onSelectBox(box)}
          >
            {index === 1 && (
              <div className="absolute top-4 right-4 bg-sunny-yellow text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}

            <CardContent className="p-8">
              <div className={`w-16 h-16 ${getBgColorClass(index)} rounded-2xl flex items-center justify-center mb-6`}>
                {getIcon(index)}
              </div>

              <h3 className="text-2xl font-bold text-dark-text mb-2">{box.name}</h3>
              <p className="text-gray-600 mb-6">{box.description}</p>

              <div className="flex items-baseline mb-6">
                <span className={`text-4xl font-bold ${getColorClass(index)}`}>
                  Rs. {box.price}
                </span>
                <span className="text-gray-500 ml-2">/box</span>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <div className={`w-2 h-2 ${getBgColorClass(index)} rounded-full mr-3`}></div>
                  <span>Fill with unlimited items</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className={`w-2 h-2 ${getBgColorClass(index)} rounded-full mr-3`}></div>
                  <span>Free delivery included</span>
                </li>
                <li className="flex items-center text-gray-700">
                  <div className={`w-2 h-2 ${getBgColorClass(index)} rounded-full mr-3`}></div>
                  <span>100% organic guarantee</span>
                </li>
              </ul>

              <Button
                className={`w-full ${getBgColorClass(index)} hover:opacity-90 text-white group-hover:shadow-lg transition-all`}
              >
                Select This Box
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
