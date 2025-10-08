"use client";

import Image from "next/image";

interface FeeRange {
  saleValue: {
    from: number;
    to: number | null;
  };
  fee: string;
  gst: string;
}

interface FeesComponentProps {
  fees: FeeRange[];
  title?: string;
}

const FeesComponent = ({ fees }: FeesComponentProps) => {
  const formatSaleValue = (from: number, to: number | null) => {
    if (to === null) {
      return `$${from.toLocaleString()}+`;
    }
    return `$${from.toLocaleString()} - $${to.toLocaleString()}`;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b-2 border-blue">
            <th className="text-left py-4 text-paragraph font-bold whitespace-nowrap">
              Sale Value
            </th>
            <th className="text-left py-4 text-paragraph font-bold">Fee</th>
            <th className="text-left py-4 text-paragraph font-bold"></th>
          </tr>
        </thead>
        <tbody>
          {fees.map((feeItem, index) => (
            <tr
              key={index}
              className={`
                border-b border-blue
                ${index % 2 === 0 ? "bg-white" : "bg-blue/5"}
                desktop-small:hover:bg-blue/10 transition-colors duration-200
              `}
            >
              <td className="py-4 text-paragraph whitespace-nowrap">
                {formatSaleValue(feeItem.saleValue.from, feeItem.saleValue.to)}
              </td>
              <td className="py-4 text-paragraph">${feeItem.fee}</td>
              <td className="py-4 text-paragraph">{feeItem.gst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeesComponent;
