"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CreditCard,
  Truck,
  Lock,
  ArrowLeft,
  CheckCircle,
  Star,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CheckoutFormData {
  email: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    company: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  billingAddress: {
    firstName: string;
    lastName: string;
    company: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: string;
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
  sameAsShipping: boolean;
  saveForFuture: boolean;
  acceptTerms: boolean;
}

const mockCartItems = [
  {
    id: "cart-1",
    product: {
      id: "1",
      title: "Wireless Bluetooth Headphones",
      thumbnail: "/placeholder-headphones.jpg",
      price: 199.99,
      sellerName: "TechGear Pro",
    },
    quantity: 1,
    selectedOptions: { color: "Black" },
  },
  {
    id: "cart-2",
    product: {
      id: "2",
      title: "Smart Fitness Tracker",
      thumbnail: "/placeholder-fitness.jpg",
      price: 149.99,
      sellerName: "TechGear Pro",
    },
    quantity: 2,
    selectedOptions: { size: "Medium" },
  },
];

export default function CheckoutPage() {
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    shippingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: "",
    },
    billingAddress: {
      firstName: "",
      lastName: "",
      company: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      phone: "",
    },
    paymentMethod: "card",
    cardDetails: {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
    },
    sameAsShipping: true,
    saveForFuture: false,
    acceptTerms: false,
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast.success("Order placed successfully!");
      
      // Redirect to order confirmation
      window.location.href = "/order-confirmation";
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateSubtotal = () => {
    return mockCartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 100 ? 0 : 9.99;
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Checkout</h1>
            <p className="text-muted-foreground">
              Complete your order securely
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingFirstName">First Name *</Label>
                      <Input
                        id="shippingFirstName"
                        value={formData.shippingAddress.firstName}
                        onChange={(e) => handleInputChange("shippingAddress.firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingLastName">Last Name *</Label>
                      <Input
                        id="shippingLastName"
                        value={formData.shippingAddress.lastName}
                        onChange={(e) => handleInputChange("shippingAddress.lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingCompany">Company (Optional)</Label>
                    <Input
                      id="shippingCompany"
                      value={formData.shippingAddress.company}
                      onChange={(e) => handleInputChange("shippingAddress.company", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingStreet">Street Address *</Label>
                    <Input
                      id="shippingStreet"
                      value={formData.shippingAddress.street}
                      onChange={(e) => handleInputChange("shippingAddress.street", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City *</Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingAddress.city}
                        onChange={(e) => handleInputChange("shippingAddress.city", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State *</Label>
                      <Select
                        value={formData.shippingAddress.state}
                        onValueChange={(value) => handleInputChange("shippingAddress.state", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingZip">ZIP Code *</Label>
                      <Input
                        id="shippingZip"
                        value={formData.shippingAddress.zipCode}
                        onChange={(e) => handleInputChange("shippingAddress.zipCode", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shippingPhone">Phone Number *</Label>
                    <Input
                      id="shippingPhone"
                      type="tel"
                      value={formData.shippingAddress.phone}
                      onChange={(e) => handleInputChange("shippingAddress.phone", e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsShipping"
                      checked={formData.sameAsShipping}
                      onCheckedChange={(checked) => handleInputChange("sameAsShipping", checked)}
                    />
                    <Label htmlFor="sameAsShipping">Same as shipping address</Label>
                  </div>

                  {!formData.sameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingFirstName">First Name *</Label>
                          <Input
                            id="billingFirstName"
                            value={formData.billingAddress.firstName}
                            onChange={(e) => handleInputChange("billingAddress.firstName", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingLastName">Last Name *</Label>
                          <Input
                            id="billingLastName"
                            value={formData.billingAddress.lastName}
                            onChange={(e) => handleInputChange("billingAddress.lastName", e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="billingStreet">Street Address *</Label>
                        <Input
                          id="billingStreet"
                          value={formData.billingAddress.street}
                          onChange={(e) => handleInputChange("billingAddress.street", e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="billingCity">City *</Label>
                          <Input
                            id="billingCity"
                            value={formData.billingAddress.city}
                            onChange={(e) => handleInputChange("billingAddress.city", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingState">State *</Label>
                          <Select
                            value={formData.billingAddress.state}
                            onValueChange={(value) => handleInputChange("billingAddress.state", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CA">California</SelectItem>
                              <SelectItem value="NY">New York</SelectItem>
                              <SelectItem value="TX">Texas</SelectItem>
                              <SelectItem value="FL">Florida</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingZip">ZIP Code *</Label>
                          <Input
                            id="billingZip"
                            value={formData.billingAddress.zipCode}
                            onChange={(e) => handleInputChange("billingAddress.zipCode", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleInputChange("paymentMethod", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal">PayPal</Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === "card" && (
                    <div className="space-y-4 pt-4 border-t">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          value={formData.cardDetails.number}
                          onChange={(e) => handleInputChange("cardDetails.number", e.target.value)}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date *</Label>
                          <Input
                            id="cardExpiry"
                            value={formData.cardDetails.expiry}
                            onChange={(e) => handleInputChange("cardDetails.expiry", e.target.value)}
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardCVV">CVV *</Label>
                          <Input
                            id="cardCVV"
                            value={formData.cardDetails.cvv}
                            onChange={(e) => handleInputChange("cardDetails.cvv", e.target.value)}
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cardName">Cardholder Name *</Label>
                        <Input
                          id="cardName"
                          value={formData.cardDetails.name}
                          onChange={(e) => handleInputChange("cardDetails.name", e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveForFuture"
                          checked={formData.saveForFuture}
                          onCheckedChange={(checked) => handleInputChange("saveForFuture", checked)}
                        />
                        <Label htmlFor="saveForFuture">Save card for future purchases</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                      required
                    />
                    <Label htmlFor="acceptTerms" className="text-sm">
                      I agree to the{" "}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3">
                    {mockCartItems.map((item) => (
                      <div key={item.id} className="flex space-x-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            by {item.product.sellerName}
                          </p>
                          {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                            <div className="flex space-x-1 mt-1">
                              {Object.entries(item.selectedOptions).map(([key, value]) => (
                                <Badge key={key} variant="outline" className="text-xs">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm">Qty: {item.quantity}</span>
                            <span className="font-medium">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Pricing Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? "FREE" : `$${calculateShipping().toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isProcessing || !formData.acceptTerms}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Order
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Lock className="h-3 w-3" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="h-3 w-3" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
