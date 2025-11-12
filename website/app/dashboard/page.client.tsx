"use client";

import { TableHeader } from "@/components/ui/table";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import type { OwnedProduct, Review, Product } from "@/types";
import {
  getMockAnalytics,
  getMockOwnedProducts,
  getMockReviews,
  mockProducts,
} from "@/lib/mock-data";
import { unlink } from "@/lib/actions";

export default function DashboardPage({
  user,
  data,
  avatar,
}: {
  user: any;
  data: any;
  avatar?: any;
}) {
  const router = useRouter();
  const [ownedProducts, _] = useState<OwnedProduct[]>(user.products);
  const [selectedProduct, setSelectedProduct] = useState<OwnedProduct | null>(
    null
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [transferEmail, setTransferEmail] = useState("");
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const [analytics, setAnalytics] = useState(getMockAnalytics());
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    price: "",
  });
  const [users, setMockUsers] = useState(data?.users ?? []);

  const handleLogout = () => router.push("/api/logout");

  const handleLinkDiscord = () => router.push("/login?force=discord");
  const handleLinkRoblox = () => router.push("/login?force=roblox");

  const handleUnlinkRoblox = async () => {
    if (!user.discordLinked)
      return alert(
        "You need to have a Roblox account linked before you can remove your Discord account."
      );

    if (confirm("Are you sure you want to unlink your Roblox account?")) {
      unlink("roblox").then(router.refresh)
    }
  };

  const handleUnlinkDiscord = async () => {
    if (!user.robloxLinked)
      return alert(
        "You need to have a Roblox account linked before you can remove your Discord account."
      );

    if (confirm("Are you sure you want to unlink your Discord account?")) {
      unlink("discord").then(router.refresh)
    }
  };

  const handleRevealKey = (productId: string) => {
    setRevealedKeys((prev) => new Set(prev).add(productId));
  };

  const handleViewReviews = (product: OwnedProduct) => {
    setSelectedProduct(product);
    setReviews(getMockReviews(product.productId));
  };

  const handleSubmitReview = () => {
    if (selectedProduct) {
      const newReview: Review = {
        id: `review_${Date.now()}`,
        productId: selectedProduct.productId,
        userId: user?.id || "",
        username: user?.username || "",
        rating: rating,
        comment: reviewComment,
        date: new Date().toISOString().split("T")[0],
      };
      setReviews([newReview, ...reviews]);
      setReviewComment("");
      setRating(5);
    }
  };

  const handleTransfer = (productId: string) => {
    if (transferEmail) {
      alert(`Transfer initiated to ${transferEmail}`);
      setTransferEmail("");
    }
  };

  const handleCreateProduct = () => {
    if (newProduct.name && newProduct.price) {
      const product: Product = {
        id: `${allProducts.length + 1}`,
        name: newProduct.name,
        description: newProduct.description,
        category: newProduct.category,
        tags: newProduct.tags.split(",").map((t) => t.trim()),
        price: Number.parseFloat(newProduct.price),
        images: ["/placeholder.svg?height=400&width=600"],
      };
      setAllProducts([...allProducts, product]);
      setNewProduct({
        name: "",
        description: "",
        category: "",
        tags: "",
        price: "",
      });
      alert("Product created successfully!");
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setMockUsers((users) =>
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "banned" : "active" }
          : u
      )
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setMockUsers((users) => users.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-950 via-black to-violet-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={avatar || "/placeholder.svg"}
              alt={user.username}
              width={40}
              height={40}
              className="rounded-full border-2 border-purple-400"
            />
            <div>
              <h2 className="text-white font-semibold">{user.username}</h2>
              <p className="text-white/60 text-sm">
                {user?.discordId ?? user.robloxId}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/10 bg-transparent"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">My Dashboard</h1>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-purple-500"
            >
              My Products
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="data-[state=active]:bg-purple-500"
            >
              Account Settings
            </TabsTrigger>
            {user.isAdmin && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-purple-500"
              >
                Admin Panel
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {ownedProducts.length === 0 ? (
              <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                <CardContent className="py-12 text-center">
                  <p className="text-white/60 mb-4">
                    {"You don't own any products yet."}
                  </p>
                  <Button
                    onClick={() => router.push("/")}
                    className="bg-linear-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                  >
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {ownedProducts.map((owned) => (
                  <Card
                    key={owned.id}
                    className="border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={owned.product.images[0] || "/placeholder.svg"}
                        alt={owned.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white">
                            {owned.product.name}
                          </CardTitle>
                          <CardDescription className="text-white/60">
                            Purchased:{" "}
                            {new Date(owned.purchaseDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">
                          {owned.product.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">
                          License Key
                        </label>
                        <div className="flex gap-2">
                          <Input
                            type={
                              revealedKeys.has(owned.id) ? "text" : "password"
                            }
                            value={owned.licenseKey}
                            readOnly
                            className="bg-white/5 border-white/10 text-white"
                          />
                          <Button
                            onClick={() => handleRevealKey(owned.id)}
                            variant="outline"
                            className="border-white/10 text-white hover:bg-white/10"
                          >
                            {revealedKeys.has(owned.id) ? "Hide" : "Reveal"}
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => handleViewReviews(owned)}
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/10 flex-1"
                            >
                              Reviews
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/95 border-white/10 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>
                                {selectedProduct?.product.name} - Reviews
                              </DialogTitle>
                              <DialogDescription className="text-white/60">
                                View and add reviews for this product
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-3">
                                <label className="text-sm font-medium">
                                  Add Your Review
                                </label>
                                <Select
                                  value={rating.toString()}
                                  onValueChange={(v) => setRating(Number(v))}
                                >
                                  <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-black/95 border-white/10 text-white">
                                    {[5, 4, 3, 2, 1].map((r) => (
                                      <SelectItem key={r} value={r.toString()}>
                                        {"⭐".repeat(r)} ({r} stars)
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Textarea
                                  placeholder="Write your review..."
                                  value={reviewComment}
                                  onChange={(e) =>
                                    setReviewComment(e.target.value)
                                  }
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                                <Button
                                  onClick={handleSubmitReview}
                                  className="bg-linear-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                                >
                                  Submit Review
                                </Button>
                              </div>
                              <div className="border-t border-white/10 pt-4 space-y-3">
                                <h4 className="font-semibold">All Reviews</h4>
                                {reviews.map((review) => (
                                  <div
                                    key={review.id}
                                    className="bg-white/5 rounded-lg p-4 space-y-2"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">
                                        {review.username}
                                      </span>
                                      <span className="text-sm text-white/60">
                                        {review.date}
                                      </span>
                                    </div>
                                    <div className="text-yellow-400">
                                      {"⭐".repeat(review.rating)}
                                    </div>
                                    <p className="text-white/80">
                                      {review.comment}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="border-white/10 text-white hover:bg-white/10 flex-1 bg-transparent"
                            >
                              Transfer
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/95 border-white/10 text-white">
                            <DialogHeader>
                              <DialogTitle>Transfer Product</DialogTitle>
                              <DialogDescription className="text-white/60">
                                Transfer {owned.product.name} to another user
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="text-sm font-medium">
                                  Recipient Email
                                </label>
                                <Input
                                  type="email"
                                  placeholder="user@example.com"
                                  value={transferEmail}
                                  onChange={(e) =>
                                    setTransferEmail(e.target.value)
                                  }
                                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                                />
                              </div>
                              <Button
                                onClick={() => handleTransfer(owned.id)}
                                className="w-full bg-linear-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                              >
                                Transfer Product
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Linked Accounts</CardTitle>
                <CardDescription className="text-white/60">
                  Manage your connected accounts and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Discord Account (always linked) */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Discord</h3>
                      <p className="text-white/60 text-sm">
                        {user.discordLinked ? (
                          <p className="text-white/60 text-sm">
                            {user.discordId}
                          </p>
                        ) : (
                          <p className="text-white/40 text-sm">Not connected</p>
                        )}
                      </p>
                    </div>
                  </div>
                  {user.discordLinked ? (
                    <Button
                      onClick={handleUnlinkDiscord}
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
                    >
                      Unlink
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLinkDiscord}
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-300 hover:bg-green-500/10 bg-transparent"
                    >
                      Link
                    </Button>
                  )}
                </div>

                {/* Roblox Account */}
                <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M18.926 23.998L.006 18.997l5.001-18.92L23.927 5.08l-5.001 18.918zM9.233 8.234l-2.287 8.646 8.646 2.287 2.287-8.646-8.646-2.287z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Roblox</h3>
                      {user.robloxLinked ? (
                        <p className="text-white/60 text-sm">{user.robloxId}</p>
                      ) : (
                        <p className="text-white/40 text-sm">Not connected</p>
                      )}
                    </div>
                  </div>
                  {user.robloxLinked ? (
                    <Button
                      onClick={handleUnlinkRoblox}
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
                    >
                      Unlink
                    </Button>
                  ) : (
                    <Button
                      onClick={handleLinkRoblox}
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-300 hover:bg-green-500/10 bg-transparent"
                    >
                      Link
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {user.isAdmin && (
            <TabsContent value="admin" className="space-y-6">
              <Tabs defaultValue="analytics" className="space-y-6">
                <TabsList className="bg-white/5 border border-white/10">
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="manage-products">Products</TabsTrigger>
                </TabsList>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-white text-sm font-medium">
                          Total Revenue
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">
                          ${analytics.totalRevenue.toFixed(2)}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          All-time earnings
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-white text-sm font-medium">
                          Total Purchases
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">
                          {analytics.totalPurchases}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          Total orders
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                      <CardHeader>
                        <CardTitle className="text-white text-sm font-medium">
                          Total Users
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-3xl font-bold text-white">
                          {analytics.activeUsers}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          All customers
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Revenue Chart
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.revenueChart}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="rgba(255,255,255,0.1)"
                          />
                          <XAxis
                            dataKey="month"
                            stroke="rgba(255,255,255,0.6)"
                          />
                          <YAxis stroke="rgba(255,255,255,0.6)" />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "rgba(0,0,0,0.9)",
                              border: "1px solid rgba(255,255,255,0.1)",
                            }}
                          />
                          <Bar dataKey="revenue" fill="#a855f7" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Recent Purchases
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-white/60">
                              Product
                            </TableHead>
                            <TableHead className="text-white/60">
                              User
                            </TableHead>
                            <TableHead className="text-white/60">
                              Amount
                            </TableHead>
                            <TableHead className="text-white/60">
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {analytics.recentPurchases.map((purchase) => (
                            <TableRow
                              key={purchase.id}
                              className="border-white/10"
                            >
                              <TableCell className="text-white">
                                {purchase.productName}
                              </TableCell>
                              <TableCell className="text-white">
                                {purchase.username}
                              </TableCell>
                              <TableCell className="text-white">
                                ${purchase.amount}
                              </TableCell>
                              <TableCell className="text-white">
                                {purchase.date}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-6">
                  <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">
                        User Management
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Manage all users on the platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-white/60">
                              Roblox ID
                            </TableHead>
                            <TableHead className="text-white/60">
                              Discord ID
                            </TableHead>
                            <TableHead className="text-white/60">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user: any) => (
                            <TableRow
                              key={user._id}
                              className="border-white/10"
                            >
                              <TableCell className="text-white">
                                {user.robloxId}
                              </TableCell>
                              <TableCell className="text-white">
                                {user.discordId}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleToggleUserStatus(user._id)
                                    }
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/10"
                                  >
                                    {user.status === "active"
                                      ? "Ban"
                                      : "Unban"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteUser(user._id)
                                    }
                                    variant="outline"
                                    className="border-red-500/50 text-red-300 hover:bg-red-500/10"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="manage-products" className="space-y-6">
                  <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Create New Product
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        Add a new product to the store
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm text-white/60">
                            Product Name
                          </label>
                          <Input
                            placeholder="Premium Shader Pack"
                            value={newProduct.name}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                name: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-white/60">
                            Category
                          </label>
                          <Input
                            placeholder="Shaders"
                            value={newProduct.category}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                category: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-white/60">
                          Description
                        </label>
                        <Textarea
                          placeholder="High-quality shader effects..."
                          value={newProduct.description}
                          onChange={(e) =>
                            setNewProduct({
                              ...newProduct,
                              description: e.target.value,
                            })
                          }
                          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm text-white/60">
                            Tags (comma separated)
                          </label>
                          <Input
                            placeholder="lighting, effects, premium"
                            value={newProduct.tags}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                tags: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-white/60">Price</label>
                          <Input
                            type="number"
                            placeholder="49.99"
                            value={newProduct.price}
                            onChange={(e) =>
                              setNewProduct({
                                ...newProduct,
                                price: e.target.value,
                              })
                            }
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleCreateProduct}
                        className="w-full bg-linear-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                      >
                        Create Product
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-white/10 bg-black/40 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-white">All Products</CardTitle>
                      <CardDescription className="text-white/60">
                        Manage existing products
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/10">
                            <TableHead className="text-white/60">
                              Name
                            </TableHead>
                            <TableHead className="text-white/60">
                              Category
                            </TableHead>
                            <TableHead className="text-white/60">
                              Price
                            </TableHead>
                            <TableHead className="text-white/60">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allProducts.map((product) => (
                            <TableRow
                              key={product.id}
                              className="border-white/10"
                            >
                              <TableCell className="text-white">
                                {product.name}
                              </TableCell>
                              <TableCell className="text-white">
                                {product.category}
                              </TableCell>
                              <TableCell className="text-white">
                                ${product.price}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-white/10 text-white hover:bg-white/10 bg-transparent"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-500/50 text-red-300 hover:bg-red-500/10 bg-transparent"
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
